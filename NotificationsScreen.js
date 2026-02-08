import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { JsonUploadstyles } from './styles'; // Import the styles from styles.js

// Notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function JsonUploadPage() {
  const [data, setData] = useState([]);

  // Load stored data from AsyncStorage on component mount
  useEffect(() => {
    const loadStoredData = async () => {
      const storedData = JSON.parse(await AsyncStorage.getItem('jsonData')) || [];
      const sortedData = sortDataByTime(storedData); // Automatically sort the loaded data
      setData(sortedData);
    };
    loadStoredData();
  }, []);

  // Handle file upload
  const handleUpload = async () => {
    try {
      // Clear all existing notifications before uploading new data
      await Notifications.dismissAllNotificationsAsync();
      console.log('All existing notifications have been cleared.');

      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri; // Access the file URI from assets
        const fileContent = await fetch(fileUri).then((res) => res.json());

        if (fileContent && Object.keys(fileContent).length > 0) {
          const jsonData = await Promise.all(
            Object.keys(fileContent).map(async (key) => {
              const notificationId = await scheduleNotification(fileContent[key]);
              return { id: key, notificationId, ...fileContent[key] }; // Store notificationId with the entry
            })
          );

          // Log the parsed data for debugging
          console.log('Parsed JSON Data:', jsonData);

          const sortedData = sortDataByTime(jsonData); // Automatically sort the uploaded data
          setData(sortedData); // Update state with sorted data
          saveToLocalStorage(sortedData); // Save sorted data to AsyncStorage
        } else {
          Alert.alert('Error', 'Uploaded file is empty or in an invalid format.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload JSON file.');
      console.error('Error during file upload:', error);
    }
  };

  // Save data to AsyncStorage
  const saveToLocalStorage = async (data) => {
    try {
      await AsyncStorage.setItem('jsonData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  };

  // Schedule a notification and return its ID
  const scheduleNotification = async (entry) => {
    if (entry.show && entry.value) {
      const [hours, minutes] = entry.value.split(':').map(Number);
      const now = new Date();
      const notificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

      if (notificationTime < now) {
        notificationTime.setDate(notificationTime.getDate() + 1); // Schedule for the next day if the time has already passed
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Reminder from ${entry.pageName}`,
          body: entry.message,
        },
        trigger: {
          hour: notificationTime.getHours(),
          minute: notificationTime.getMinutes(),
          repeats: true, // Schedule for daily notifications
        },
      });

      return notificationId; // Return the notification ID
    }
    return null;
  };

  // Sort data by time (value)
  const sortDataByTime = (dataToSort) => {
    return [...dataToSort].sort((a, b) => {
      const [hoursA, minutesA] = a.value.split(':').map(Number);
      const [hoursB, minutesB] = b.value.split(':').map(Number);

      return hoursA !== hoursB ? hoursA - hoursB : minutesA - minutesB;
    });
  };

  // Handle row deletion, cancel the associated notification
  const deleteRow = async (id, notificationId) => {
    const newData = data.filter((item) => item.id !== id);
    const sortedData = sortDataByTime(newData); // Sort data after deletion
    setData(sortedData);
    saveToLocalStorage(sortedData);

    if (notificationId) {
      try {
        await Notifications.dismissNotificationAsync(notificationId);
        console.log(`Notification with ID ${notificationId} cancelled.`);
      } catch (error) {
        console.error('Error cancelling notification:', error);
      }
    }
  };

  // Clear all scheduled notifications manually
  const clearAllNotifications = async () => {
    try {
      await Notifications.dismissAllNotificationsAsync();
      Alert.alert('Notifications', 'All scheduled notifications have been cleared.');
      console.log('All scheduled notifications cleared.');
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Render table row
  const renderRow = ({ item }) => (
    <View style={JsonUploadstyles.row}>
      <Text style={JsonUploadstyles.cell}>{item.pageName}</Text>
      <Text style={JsonUploadstyles.cell}>{item.keyName}</Text>
      <Text style={JsonUploadstyles.cell}>{item.value}</Text>
      <Text style={JsonUploadstyles.cell}>{item.message}</Text>
      <TouchableOpacity onPress={() => deleteRow(item.id, item.notificationId)}>
        <Text style={JsonUploadstyles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={JsonUploadstyles.container}>
      <TouchableOpacity onPress={handleUpload}>
        <Text>Upload JSON</Text>
      </TouchableOpacity>

      {/* Button to clear all notifications */}
      <TouchableOpacity onPress={clearAllNotifications} style={JsonUploadstyles.clearButton}>
        <Text>Clear All Notifications</Text>
      </TouchableOpacity>
      
      <View style={JsonUploadstyles.table}>
        {/* Table Header */}
        <View style={JsonUploadstyles.rowHeader}>
          <Text style={JsonUploadstyles.headerCell}>Page</Text>
          <Text style={JsonUploadstyles.headerCell}>Key</Text>
          <Text style={JsonUploadstyles.headerCell}>Time</Text>
          <Text style={JsonUploadstyles.headerCell}>Message</Text>
          <Text style={JsonUploadstyles.headerCell}>Action</Text>
        </View>

        {/* Table Content */}
        <FlatList
          data={data}
          renderItem={renderRow}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No data available</Text>}
        />
      </View>
    </View>
  );
}