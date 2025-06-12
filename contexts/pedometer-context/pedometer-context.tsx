import {createContext, useContext, useEffect, useRef, useState} from 'react';
import {getTodayDateString} from '../../utils';
import {
  DAILY_GOAL_STORAGE_KEY,
  DATE_STORAGE_KEY,
  PEDOMETER_BUFFER_TIME,
  PEDOMETER_INTERVAL,
  PEDOMETER_STORAGE_KEY,
  PEDOMETER_THRESHOLD,
} from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  accelerometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import {bufferTime, map, Subscription} from 'rxjs';

type PedometerContextType = {
  steps: number;
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  errorMessage: string | null;
};

const PedometerContext = createContext<PedometerContextType | undefined>(
  undefined,
);

export const PedometerProvider = ({children}: {children: React.ReactNode}) => {
  const [steps, setSteps] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dailyGoal, setDailyGoalState] = useState(2000);
  const lastStepTimeRef = useRef(0);
  const lastValuesRef = useRef<number[]>([]);

  const setDailyGoal = async (goal: number) => {
    try {
      setDailyGoalState(goal);
      await AsyncStorage.setItem(DAILY_GOAL_STORAGE_KEY, goal.toString());
    } catch (e) {
      console.error('Failed to set daily goal in storage', e);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const savedDate = await AsyncStorage.getItem(DATE_STORAGE_KEY);
        const today = getTodayDateString();

        if (savedDate !== today) {
          await AsyncStorage.setItem(DATE_STORAGE_KEY, today);
          await AsyncStorage.setItem(PEDOMETER_STORAGE_KEY, '0');
          setSteps(0);
        } else {
          const savedSteps = await AsyncStorage.getItem(PEDOMETER_STORAGE_KEY);
          if (savedSteps !== null) {
            setSteps(Number(savedSteps));
          }
        }

        const storedGoal = await AsyncStorage.getItem(DAILY_GOAL_STORAGE_KEY);
        if (storedGoal) {
          setDailyGoalState(Number(storedGoal));
        }
      } catch (e) {
        console.error('Failed to load steps from storage', e);
      }
    })();
  }, []);

  useEffect(() => {
    async function saveSteps() {
      await AsyncStorage.setItem(PEDOMETER_STORAGE_KEY, steps.toString()).catch(
        e => console.error('Failed to save steps', e),
      );
    }

    if (steps !== 0) {
      saveSteps();
    }
  }, [steps]);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, PEDOMETER_INTERVAL);

    const subscription: Subscription = accelerometer
      .pipe(
        map(({x, y, z}) => Math.sqrt(x * x + y * y + z * z)),
        bufferTime(PEDOMETER_BUFFER_TIME),
        map(values => {
          if (values.length === 0) return false;

          lastValuesRef.current = [...lastValuesRef.current, ...values].slice(
            -20,
          );

          const now = Date.now();
          const timeSinceLastStep = now - lastStepTimeRef.current;

          const average =
            lastValuesRef.current.reduce((a, b) => a + b, 0) /
            lastValuesRef.current.length;
          const max = Math.max(...lastValuesRef.current);
          const min = Math.min(...lastValuesRef.current);

          const isStep =
            max - min > PEDOMETER_THRESHOLD &&
            timeSinceLastStep > PEDOMETER_INTERVAL &&
            max > average * PEDOMETER_THRESHOLD;

          if (isStep) {
            lastStepTimeRef.current = now;
            return true;
          }

          return false;
        }),
      )
      .subscribe({
        next: isStep => {
          if (isStep) {
            lastValuesRef.current = [];
            setSteps(prev => prev + 1);
          }
        },
        error: () => setErrorMessage('Accelerometer not available'),
      });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <PedometerContext.Provider
      value={{steps, dailyGoal, setDailyGoal, errorMessage}}>
      {children}
    </PedometerContext.Provider>
  );
};

export const usePedometerContext = () => {
  const context = useContext(PedometerContext);
  if (!context) {
    throw new Error(
      'usePedometerContext must be used within a PedometerProvider',
    );
  }
  return context;
};
