import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Tableview() {
  const [storedData, setStoredData] = useState([]);

  // Load data from AsyncStorage
  const loadDataFromStorage = async () => {
    try {
      // Get all keys
      const keys = await AsyncStorage.getAllKeys();
      const allData = await AsyncStorage.multiGet(keys);
      
      // Parse each item and filter for time toggle data
      const parsedData = allData
        .map(([key, value]) => JSON.parse(value))
        .filter(item => item && item.time); // Ensure we only handle valid time toggle data

      if (parsedData.length > 0) {
        setStoredData(parsedData);
      } else {
        Alert.alert('No Data', 'No time data found in local storage.');
      }
    } catch (error) {
      console.error('Error loading data from AsyncStorage', error);
      Alert.alert('Error', 'Failed to load data from local storage.');
    }
  };

  // Load data when component mounts
  useEffect(() => {
    loadDataFromStorage();
  }, []);

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.pageName}</Text>
      <Text style={styles.cell}>{item.show ? 'Enabled' : 'Disabled'}</Text>
      <Text style={styles.cell}>{item.time}</Text>
      <Text style={styles.cell}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.tableHeader}>Stored Time Data</Text>

      <View style={styles.table}>
        <View style={styles.rowHeader}>
          <Text style={styles.headerCell}>Page Name</Text>
          <Text style={styles.headerCell}>Toggle State</Text>
          <Text style={styles.headerCell}>Time</Text>
          <Text style={styles.headerCell}>Message</Text>
        </View>
        {/* FlatList to display each row of stored data */}
        {storedData.length > 0 ? (
          <FlatList
            data={storedData}
            renderItem={renderRow}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  tableHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  rowHeader: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
