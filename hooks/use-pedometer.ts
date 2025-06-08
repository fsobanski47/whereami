import { useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import Pedometer from 'react-native-pedometer-ios-android';

export function usePedometer() {
  const [steps, setSteps] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: any;

    Pedometer.isSupported()
      .then((supported: boolean) => {
        if (!supported) {
          setError('Pedometer is not supported on this device');
          return;
        }

        const emitter = new NativeEventEmitter(NativeModules.Pedometer);
        subscription = emitter.addListener('StepCounter', (data: { steps: number }) => {
          setSteps(Math.floor(data.steps));
        });

        Pedometer.startStepCounter();
      })
      .catch(err => {
        setError(err.message || 'Unknown error');
      });

    return () => {
      Pedometer.stopStepCounter();
      subscription?.remove();
    };
  }, []);

  return { steps, error };
}