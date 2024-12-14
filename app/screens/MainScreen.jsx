import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../components/Home";
import Pay from "../components/Pay";
import Ticket from "../components/Ticket";
import { primary, secondary } from "../utilities/color";

const Tab = createBottomTabNavigator();
const { height, width } = Dimensions.get("screen");

export default function MainScreen() {

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Tab.Navigator
        initialRouteName="Pay"
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            height: height * 0.08,
          },
          tabBarButton: (props) => (
            <TouchableWithoutFeedback {...props}>
              <View style={{ flex: 1, alignItems: "center" }}>
                {props.children}
              </View>
            </TouchableWithoutFeedback>
          ),
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  height: height * 0.08,
                  width: width * 0.3,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: focused ? height * 0.06 : height * 0.055,
                }}
              >
                <Image
                  source={require("../assets/pictures/home.png")}
                  style={{
                    height: "35%",
                    aspectRatio: 1,
                    tintColor: focused ? primary : secondary,
                  }}
                  resizeMode="contain"
                />
                {focused ? (
                  <Text
                    style={{
                      color: secondary,
                      fontFamily: "Poppins-Light",
                      fontSize: height * 0.013,
                    }}
                  >
                    Home
                  </Text>
                ) : null}
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Pay"
          component={Pay}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  height: height * 0.08,
                  width: width * 0.3,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: focused ? height * 0.06 : height * 0.055,
                }}
              >
                <Image
                  source={require("../assets/pictures/pay.png")}
                  style={{
                    height: "35%",
                    aspectRatio: 1,
                    tintColor: focused ? primary : secondary,
                  }}
                  resizeMode="contain"
                />
                {focused ? (
                  <Text
                    style={{
                      color: secondary,
                      fontFamily: "Poppins-Light",
                      fontSize: height * 0.013,
                    }}
                  >
                    Pay
                  </Text>
                ) : null}
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Ticket"
          component={Ticket}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  height: height * 0.08,
                  width: width * 0.3,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: focused ? height * 0.06 : height * 0.055,
                }}
              >
                <Image
                  source={require("../assets/pictures/ticket.png")}
                  style={{
                    height: "35%",
                    aspectRatio: 1,
                    tintColor: focused ? primary : secondary,
                  }}
                  resizeMode="contain"
                />
                {focused ? (
                  <Text
                    style={{
                      color: secondary,
                      fontFamily: "Poppins-Light",
                      fontSize: height * 0.013,
                    }}
                  >
                    Ticket
                  </Text>
                ) : null}
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
