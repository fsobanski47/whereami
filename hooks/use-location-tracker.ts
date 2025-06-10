import {useEffect, useState, useRef} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {
  TRACKER_INTERVAL,
  TRACKER_MAXIMUM_AGE,
  TRACKER_TIMEOUT,
} from '../constants';

export function useLocationTracker() {
  const [route, setRoute] = useState<{latitude: number; longitude: number}[]>(
    [],
  );

  useEffect(() => {
    const trackPosition = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setRoute(prev => [...prev, {latitude, longitude}]);
        },
        error => {
          console.error('Location error:', error.message);
        },
        {
          enableHighAccuracy: false,
          timeout: TRACKER_TIMEOUT,
          maximumAge: TRACKER_MAXIMUM_AGE,
        },
      );
    };

    const intervalId = setInterval(trackPosition, TRACKER_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return route;
}
