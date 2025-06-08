import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import type { GeolocationResponse, GeolocationError } from '@react-native-community/geolocation';


export default function Map() {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
    useEffect(() => {
      const requestLocation = async () => {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setErrorMsg('Permission to access location was denied');
            return;
          }
        }
  
        Geolocation.getCurrentPosition(
          (position: GeolocationResponse) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error: GeolocationError) => {
            setErrorMsg(error.message);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
      };
  
      requestLocation();
    }, []);
  
    if (errorMsg) {
      return (
        <View style={styles.centered}>
          <Text>{errorMsg}</Text>
        </View>
      );
    }
  
    if (!location) {
      return (
        <View style={styles.centered}>
          <Text>Ładowanie lokalizacji...</Text>
        </View>
      );
    }
  
    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Twoja pozycja"
        />
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