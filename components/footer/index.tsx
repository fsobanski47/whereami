import React from 'react';
import {Text, View} from 'react-native';
import {usePedometerContext} from '../../contexts/pedometer-context/pedometer-context';
import styles from '../../styles/footer-styles';

export default function Footer() {
  const {steps, errorMessage} = usePedometerContext();

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        {errorMessage ? `${errorMessage}` : `Kroki dzisiaj: ${steps}`}
      </Text>
    </View>
  );
}
