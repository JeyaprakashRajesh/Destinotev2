import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Map from "./mapComponents/Map";
import SearchScreen from "./mapComponents/SearchScreen";
import Directions from "./mapComponents/Directions";

const Stack = createNativeStackNavigator();

export default function Home() {
  const [direction , setDirection] = useState(null)
  return (
    <Stack.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Map">
        {(props) => <Map {...props} setDirection={setDirection}/> } 
      </Stack.Screen>
      <Stack.Screen name="Search">
        {(props) => <SearchScreen {...props} setDirection={setDirection}/>}
      </Stack.Screen>
      <Stack.Screen name="directions">
        {(props)=> <Directions {...props} direction={direction} setDirection={setDirection} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
