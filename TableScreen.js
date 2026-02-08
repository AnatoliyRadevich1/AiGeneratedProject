import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// Sample updated JSON Data
const timeData = {
  "1307066767": {
    "show": true,
    "value": "12:54",
    "validation": "Validation message for time1 on database",
    "message": "Test message for time1",
    "pageName": "database",
    "keyName": "time1"
  },
  "1307066768": {
    "show": true,
    "value": "13:30",
    "validation": "Validation message for time2 on database",
    "message": "Test message for time2",
    "pageName": "database",
    "keyName": "time2"
  },
  "1307066769": {
    "show": true,
    "value": "14:15",
    "validation": "Validation message for time1 on solution",
    "message": "Test message for time1",
    "pageName": "solution",
    "keyName": "time1"
  }
};

// Convert timeData into an array to display it in a FlatList
const flattenTimeData = (data) => {
  return Object.keys(data).map(key => {
    return {
      id: key, // Use the unique key as the ID
      ...data[key]
    };
  });
};

const flattenedData = flattenTimeData(timeData);

const TableScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.pageName}</Text>
      <Text style={styles.cell}>{item.keyName}</Text>
      <Text style={styles.cell}>{item.value}</Text>
      <Text style={styles.cell}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.header}>
        <Text style={styles.headerCell}>Page Name</Text>
        <Text style={styles.headerCell}>Key Name</Text>
        <Text style={styles.headerCell}>Value</Text>
        <Text style={styles.headerCell}>Message</Text>
      </View>
      {/* Table Content */}
      <FlatList
        data={flattenedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
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
  },
});

export default TableScreen;
