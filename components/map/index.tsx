import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, {Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import type {
  GeolocationResponse,
  GeolocationError,
} from '@react-native-community/geolocation';
import {useLocationTracker} from '../../hooks/use-location-tracker';
import {
  TRACKER_MAP_LOADING_TIMEOUT,
  TRACKER_MAXIMUM_AGE,
  TRACKER_TIMEOUT,
} from '../../constants';

export default function Map() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const route = useLocationTracker();
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        setErrorMessage('Permission to access location was denied');
      }
    } else {
      setHasPermission(true);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error: GeolocationError) => {
        setErrorMessage(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: TRACKER_TIMEOUT,
        maximumAge: TRACKER_MAXIMUM_AGE,
      },
    );
  };

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (hasPermission) {
      getCurrentLocation();
    }
  }, [hasPermission]);

  const handleMapReady = useCallback(() => {
    setTimeout(() => {
      setIsMapReady(true);
    }, TRACKER_MAP_LOADING_TIMEOUT);
  }, []);

  if (errorMessage) {
    return (
      <View style={styles.centered}>
        <Text>{errorMessage}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centered}>
        <Text>Loading location...</Text>
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      showsUserLocation={isMapReady}
      showsMyLocationButton={isMapReady}
      onMapReady={handleMapReady}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}>
      {isMapReady && route.length > 1 && (
        <Polyline coordinates={route} strokeColor="#1e90ff" strokeWidth={4} />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
