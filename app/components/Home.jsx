import { View , Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Map from "./Map";

const stack = createNativeStackNavigator()

export default function Home() {
    return(
        <stack.Navigator
            initialRouteName="Map"
            screenOptions={{
                headerShown : false
            }}
        >
            <stack.Screen name="Map" component={Map} />
        </stack.Navigator>
    )
}