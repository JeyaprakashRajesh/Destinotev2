import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetStarted from "../components/GetStarted";
import Phone from "../components/Phone";
import Otp from "../components/Otp";

const Stack = createNativeStackNavigator();

export default function AuthScreen({ setScreen }) {
  return (
    <Stack.Navigator
      initialRouteName="GetStarted"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="Phone" component={Phone} />
      <Stack.Screen name="Otp">
        {(props) => <Otp {...props} setScreen={setScreen} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
