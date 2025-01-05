import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View , StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure you're importing AsyncStorage correctly
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


import AuthScreen from './screens/AuthScreen/AuthScreen';
import MainScreen from './screens/MainScreen/MainScreen';
export default function App() {
  const [screen, setScreen] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token != null) {
        setScreen(<AuthScreen setScreen = {setScreen} />);
      } else {
        setScreen(<MainScreen />);
      }
    };

    checkToken();
  }, []); 

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
        
          {screen}
        </SafeAreaView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831"
  }
});
