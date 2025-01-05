import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Map from "./Map";

const Stack = createNativeStackNavigator();

export default function Home() {

  return (
    <Stack.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Map"
        component={(props) => <Map {...props}  />}
      />
    </Stack.Navigator>
  );
}
