import {useEffect, useState, useRef, use} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {
  ROUTE_STORAGE_KEY,
  TRACKER_INTERVAL,
  TRACKER_MAXIMUM_AGE,
  TRACKER_TIMEOUT,
} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLocationTracker() {
  const [route, setRoute] = useState<{latitude: number; longitude: number}[]>(
    [],
  );

  useEffect(() => {
    async function loadRoute() {
      const storedData = await AsyncStorage.getItem(ROUTE_STORAGE_KEY);
      if (storedData) {
        const {date, route: savedRoute} = JSON.parse(storedData);
        const savedDay = new Date(date).getDate();
        const today = new Date().getDate();

        if (savedDay !== today) {
          await AsyncStorage.removeItem(ROUTE_STORAGE_KEY);
          setRoute([]);
        } else {
          setRoute(savedRoute);
        }
      }
    }

    loadRoute();
  }, []);

  useEffect(() => {
    async function saveRoute() {
      await AsyncStorage.setItem(
        ROUTE_STORAGE_KEY,
        JSON.stringify({date: new Date().toISOString(), route}),
      );
    }
    if (route.length > 0) {
      saveRoute();
    }
  }, [route]);

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
