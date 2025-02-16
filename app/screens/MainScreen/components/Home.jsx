import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Map from "./mapComponents/Map";
import SearchScreen from "./mapComponents/SearchScreen";

const Stack = createNativeStackNavigator();

export default function Home() {
  return (
    <Stack.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Map">
        {(props) => <Map {...props} />} 
      </Stack.Screen>
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
}
