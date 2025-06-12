import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {usePedometerContext} from '../../contexts/pedometer-context/pedometer-context';

export default function Footer() {
  const {steps, errorMessage} = usePedometerContext();

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        {errorMessage ? `Błąd: ${errorMessage}` : `Kroki dzisiaj: ${steps}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 60,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  footerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
