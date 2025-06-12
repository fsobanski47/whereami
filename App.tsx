import React, {useEffect} from 'react';
import {View} from 'react-native';
import Footer from './components/footer';
import Header from './components/header';
import Map from './components/map';
import {PedometerProvider} from './contexts/pedometer-context/pedometer-context';
import styles from './styles/app-styles';

export default function App() {
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
