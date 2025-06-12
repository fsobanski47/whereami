import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Header from './components/header';
import Map from './components/map';
import Footer from './components/footer';
import {PedometerProvider} from './contexts/pedometer-context/pedometer-context';
import styles from './styles/app-styles';

export default function App() {
  useEffect(() => {});
  return (
    <PedometerProvider>
      <View style={styles.container}>
        <Header />
        <Map />
        <Footer />
      </View>
    </PedometerProvider>
  );
}
