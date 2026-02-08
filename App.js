import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import NotificationsScreen from './NotificationsScreen';
import TableScreen from './TableScreen';
import TableView from './Tableview';
import JsonUploadPage from './JsonUpload';
import { TouchableOpacity, StyleSheet, BackHandler, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

export default function App() {
  // Function to handle exit with confirmation
  const handleExitApp = () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Exit App',
        'iOS does not allow apps to be closed programmatically. Please close the app manually.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen 
          name="Home" 
          component={HomeScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                <Ionicons name="notifications" size={24} color="#000" style={styles.headerIcon} />
              </TouchableOpacity>
            ),
          })}
        />
        <Drawer.Screen 
          name="Notifications" 
          component={NotificationsScreen} 
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="home" size={24} color="#000" style={styles.headerIcon} />
              </TouchableOpacity>
            ),
          })}
        />
        <Drawer.Screen 
          name="Table" 
          component={TableScreen} 
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="home" size={24} color="#000" style={styles.headerIcon} />
              </TouchableOpacity>
            ),
          })}
        />
        <Drawer.Screen 
          name="Table view" 
          component={TableView} 
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="home" size={24} color="#000" style={styles.headerIcon} />
              </TouchableOpacity>
            ),
          })}
        />
        <Drawer.Screen 
          name="Json view" 
          component={JsonUploadPage} 
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="home" size={24} color="#000" style={styles.headerIcon} />
              </TouchableOpacity>
            ),
          })}
        />
        {/* Conditionally render the Exit button only for Android */}
        {Platform.OS === 'android' && (
          <Drawer.Screen
            name="Exit"
            component={() => null} // No component needed
            options={{
              drawerLabel: 'Exit',
              headerShown: false,
              drawerIcon: () => (
                <Ionicons name="exit" size={24} color="#000" />
              ),
            }}
            listeners={{
              drawerItemPress: (e) => {
                e.preventDefault(); // Prevent default behavior (navigation)
                handleExitApp(); // Trigger the exit confirmation
              },
            }}
          />
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    marginRight: 15,
  },
});

