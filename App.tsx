import React from 'react';
import {StyleSheet, View} from 'react-native';
import Header from './components/header';
import Map from './components/map';
import Footer from './components/footer';

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <Map />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
