import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hashcode function to generate a unique key for storage based on pageName
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};

const TimeToggle = ({ pageName, message }) => {
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [timeValue, setTimeValue] = useState('');
  const [validationError, setValidationError] = useState('');

  const STORAGE_KEY = hashCode(pageName); // Use hash of pageName as the key

  // Load saved state from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
        if (savedData) {
          setShowTimeInput(savedData.show);
          setTimeValue(savedData.time);
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage', error);
      }
    };

    loadData();
  }, [STORAGE_KEY]);

  // Save data to AsyncStorage
  const saveToLocalStorage = async () => {
    try {
      const data = {
        pageName: pageName, // Save the pageName
        show: showTimeInput,
        time: timeValue,
        message: message,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      Alert.alert('Saved', 'Time and toggle state saved successfully.');
    } catch (error) {
      console.error('Error saving data to AsyncStorage', error);
      Alert.alert('Error', 'Failed to save data.');
    }
  };

  // Handle Toggle
  const handleToggleSwitch = () => {
    setShowTimeInput(!showTimeInput);

    if (!showTimeInput) {
      setTimeValue(''); // Clear time value when toggled off
    }
  };

  // Validate the time format (HH:MM)
  const validateTime = () => {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timePattern.test(timeValue)) {
      setValidationError('Invalid time format. Please use HH:MM.');
      return false;
    }
    setValidationError('');
    return true;
  };

  // Handle Save button press
  const handleSave = () => {
    if (!validateTime()) {
      return;
    }
    saveToLocalStorage();
  };

  return (
    <View style={styles.container}>
      {/* Toggle switch */}
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Enable Time Input</Text>
        <Switch
          value={showTimeInput}
          onValueChange={handleToggleSwitch}
        />
      </View>

      {/* Time input (shown only if toggle is ON) */}
      {showTimeInput && (
        <View style={styles.timeInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            value={timeValue}
            onChangeText={setTimeValue}
            keyboardType="default"  // Allows full input, including ":"
            maxLength={5}
          />
          {/* Validation error */}
          {validationError ? <Text style={styles.errorText}>{validationError}</Text> : null}
        </View>
      )}

      {/* Save button */}
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
  },
  timeInputContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
    marginBottom: 10,
    width: 100,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
  },
});

export default TimeToggle;
