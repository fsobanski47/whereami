import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>whereami</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 28,
    textTransform: 'lowercase',
    fontWeight: 'bold',
  },
});
