declare module 'react-native-pedometer' {
    type PedometerResult = {
      startDate: string;
      endDate: string;
      numberOfSteps: number;
    };
  
    const Pedometer: {
      isSupported(): Promise<boolean>;
      startPedometerUpdates(callback: (result: PedometerResult) => void): any;
      stopPedometerUpdates(): void;
      getStepCount(startDate: Date, endDate: Date): Promise<PedometerResult>;
    };
  
    export default Pedometer;
  }