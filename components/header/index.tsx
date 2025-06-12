import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {usePedometerContext} from '../../contexts/pedometer-context/pedometer-context';
import styles from '../../styles/header-styles';

export default function Header() {
  const {steps, dailyGoal, setDailyGoal} = usePedometerContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState(dailyGoal.toString());

  const progress = (steps / dailyGoal) * 100;
  const progressText = `${progress.toFixed(0)}%`;

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>whereami</Text>
        <TouchableOpacity
          onPress={() => {
            setInput(dailyGoal.toString());
            setModalVisible(true);
          }}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, {width: `${progress}%`}]} />
            </View>
            <Text style={styles.progressText}>{progressText}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ustaw nowy cel dzienny</Text>
            <TextInput
              keyboardType="numeric"
              value={input}
              onChangeText={setInput}
              style={styles.input}
              placeholder="Wprowadź dzienny cel kroków."
              placeholderTextColor="#aaa"
            />
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  const goal = parseInt(input);
                  if (!isNaN(goal)) {
                    setDailyGoal(goal);
                    setModalVisible(false);
                  }
                }}>
                <Text style={styles.buttonText}>Zapisz</Text>
              </Pressable>
              <Pressable
                style={styles.button}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Anuluj</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
