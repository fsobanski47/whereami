import {StyleSheet} from 'react-native';

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

export const polylineStyle = {
  strokeColor: '#1e90ff',
  strokeWidth: 4,
};

export default styles;
