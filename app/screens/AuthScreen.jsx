import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetStarted from "../components/GetStarted";
import Phone from "../components/Phone";
import Otp from "../components/Otp";

const stack = createNativeStackNavigator()

export default function AuthScreen() {
  return (
    <stack.Navigator
    initialRouteName="GetStarted"
    screenOptions={{
        headerShown : false,
    }}
    >
      <stack.Screen name="GetStarted" component={GetStarted} />
      <stack.Screen name="Phone" component={Phone} />
      <stack.Screen name="Otp" component={Otp} />
    </stack.Navigator>
  );
}
