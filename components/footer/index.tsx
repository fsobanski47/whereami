import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePedometer } from '../../hooks/use-pedometer';

export default function Footer() {
  const { steps, error } = usePedometer();

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        {error ? `Błąd: ${error}` : `Kroki dzisiaj: ${steps}`}
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