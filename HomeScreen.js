import React from 'react';
import { View, StyleSheet } from 'react-native';
import TimeToggle from './components/TimeToggle';  // Import the TimeToggle component

export default function TimeTogglePage() {
  return (
    <View style={styles.pageContainer}>
      {/* Use the TimeToggle component with different pageName and message */}
      <TimeToggle pageName="Page1" message="This is a custom message for Page 1" />
      <TimeToggle pageName="Page2" message="This is a custom message for Page 2" />
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
