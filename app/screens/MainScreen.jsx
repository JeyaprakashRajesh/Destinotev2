import { View, Text, StatusBar , StyleSheet } from "react-native";
import {
  primary,
  secondary,
  secondaryAcent,
  thirtiary,
} from "../utilities/color";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Map from "../components/Map"
import Pay from "../components/Pay"
import Ticket from "../components/Ticket"

const Tab = createBottomTabNavigator();


export default function MainScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Tab.Navigator>
        <Tab.Screen name="map" component={Map}/>
        <Tab.Screen name="map" component={Pay}/>
        <Tab.Screen name="map" component={Ticket}/>
      </Tab.Navigator>
    </View>
  );
}


const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'white'
    }
})