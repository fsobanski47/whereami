import {useEffect, useRef, useState} from 'react';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {Subscription} from 'rxjs';
import {map, filter, bufferTime} from 'rxjs/operators';
import {
  PEDOMETER_BUFFER_TIME,
  PEDOMETER_INTERVAL,
  PEDOMETER_STORAGE_KEY,
  PEDOMETER_THRESHOLD,
  STORAGE_DATE_KEY,
} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getTodayDateString} from '../utils';

export function usePedometer() {
  const [steps, setSteps] = useState(0);
  const lastStepTimeRef = useRef(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const lastValuesRef = useRef<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const savedDate = await AsyncStorage.getItem(STORAGE_DATE_KEY);
        const today = getTodayDateString();

        if (savedDate !== today) {
          await AsyncStorage.setItem(STORAGE_DATE_KEY, today);
          await AsyncStorage.setItem(PEDOMETER_STORAGE_KEY, '0');
          setSteps(0);
        } else {
          const savedSteps = await AsyncStorage.getItem(PEDOMETER_STORAGE_KEY);
          if (savedSteps !== null) {
            setSteps(Number(savedSteps));
          }
        }
      } catch (e) {
        console.error('Failed to load steps from storage', e);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(PEDOMETER_STORAGE_KEY, steps.toString()).catch(e =>
      console.error('Failed to save steps', e),
    );
  }, [steps]);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, PEDOMETER_INTERVAL);

    const subscription: Subscription = accelerometer
      .pipe(
        map(({x, y, z}) => Math.sqrt(x * x + y * y + z * z)),
        bufferTime(PEDOMETER_BUFFER_TIME),
        map(values => {
          if (values.length === 0) {
            return false;
          }

          lastValuesRef.current = [...lastValuesRef.current, ...values].slice(
            -20,
          );

          const recentValues = lastValuesRef.current;
          if (recentValues.length < 5) {
            return false;
          }

          const now = Date.now();
          const timeSinceLastStep = now - lastStepTimeRef.current;
          const average =
            recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
          const max = Math.max(...recentValues);
          const min = Math.min(...recentValues);

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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {steps, errorMessage};
}
