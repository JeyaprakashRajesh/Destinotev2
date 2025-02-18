import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BACKEND_URL } from "../../../utilities/routes";
import Pay from "./payComponents/Pay";
import TransactionHistory from "./payComponents/TransactionHistory";

const Stack = createNativeStackNavigator();

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/user/get-details`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("API Response:", response.data);

          if (response.data && response.data.data) {
            setData(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        console.log("Token not found");
      }
    })();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="pay"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="pay">
        {(props) => <Pay {...props} data={data} setData={setData} />}
      </Stack.Screen>
      <Stack.Screen name="transaction">
        {(props) => <TransactionHistory {...props} data={data} setData={setData} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
