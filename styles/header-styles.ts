import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  header: {
    height: 120,
    paddingTop: 10,
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
  progressContainer: {
    marginTop: 8,
    width: 200,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#444',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1e90ff',
  },
  progressText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 24,
    borderRadius: 12,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#888',
    width: '100%',
    color: '#fff',
    fontSize: 16,
    marginBottom: 24,
    padding: 4,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#555',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default styles;
