import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { primary, secondary, secondaryAcent, thirtiary } from "../../../utilities/color";
import { BACKEND_URL } from "../../../utilities/routes";

const { height, width } = Dimensions.get("screen");


export default function Phone({ navigation }) {
  const [phone, setPhone] = useState("");

  async function handleGetOtp() {
    if (phone.length !== 10) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      await AsyncStorage.setItem("phone", phone); // Store phone number in AsyncStorage

      const response = await axios.post(`${BACKEND_URL}/api/user/phone`, { phone });

      if (response.status === 200) {
        navigation.navigate("Otp"); // Navigate to OTP screen
      } else {
        Alert.alert("Error", "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Could not connect to server. Please check your connection.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.backContainer}>
        <Pressable style={styles.back} onPress={() => navigation.pop()}>
          <Image
            style={styles.backImage}
            source={require("../../../assets/pictures/back.png")}
            resizeMode="contain"
          />
        </Pressable>
      </View>
      <View style={styles.header}>
        <View style={styles.headerImageContainer}>
          <Image
            style={styles.headerImage}
            resizeMode="contain"
            source={require("../../../assets/pictures/phone.png")}
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerContentText}>Enter the Phone Number to continue</Text>
        </View>
      </View>
      <View style={styles.phoneContainer}>
        <Text style={styles.phoneLabel}>Phone number</Text>
        <TextInput
          style={styles.phoneInput}
          keyboardType="numeric"
          value={phone}
          onChangeText={(val) => {
            const numericValue = val.replace(/[^0-9]/g, ""); // Allow only numbers
            if (numericValue.length <= 10) {
              setPhone(numericValue); // Restrict to 10 digits
            }
          }}
          maxLength={10}
          placeholder="Enter phone number"
          placeholderTextColor="grey"
        />
      </View>
      <View style={styles.lineContainer}>
        <View style={styles.lineElement}></View>
        <View style={styles.lineMiddle}>
          <Image
            source={require("../../../assets/pictures/cross.png")}
            resizeMode="contain"
            style={styles.lineMiddleImage}
          />
        </View>
        <View style={styles.lineElement}></View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleGetOtp}>
        <Text style={styles.buttonText}>Get OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: secondary,
    flex: 1,
    alignItems: "center",
  },
  backContainer: {
    marginTop: "10%",
    height: height * 0.05,
    width: width * 0.85,
  },
  back: {
    aspectRatio: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  backImage: {
    height: "60%",
  },
  header: {
    width: width * 0.85,
    height: height * 0.08,
    marginTop: height * 0.025,
    flexDirection: "row",
    alignItems: "center",
  },
  headerImageContainer: {
    aspectRatio: 1,
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerImage: {
    height: "70%",
    width: "90%",
  },
  headerContent: {
    height: "100%",
    flex: 1,
    marginLeft: "5%",
    justifyContent: "center",
  },
  headerContentText: {
    color: thirtiary,
    fontFamily: "Poppins-Regular",
    fontSize: width * 0.05,
  },
  phoneContainer: {
    marginTop: height * 0.04,
    width: width * 0.85,
  },
  phoneLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: width * 0.04,
    color: thirtiary,
    marginBottom: 5,
  },
  phoneInput: {
    borderWidth: width * 0.005,
    borderColor: primary,
    height: width * 0.13,
    borderRadius: width * 0.03,
    fontSize: width * 0.035,
    color: thirtiary,
    fontFamily: "Poppins-Regular",
    backgroundColor: secondaryAcent,
    paddingLeft: width * 0.05,
  },
  lineContainer: {
    width: width * 0.85,
    height: height * 0.04,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    overflow: "hidden",
    marginTop: width * 0.05,
    marginBottom: width * 0.05,
  },
  lineElement: {
    borderColor: thirtiary,
    borderWidth: width * 0.002,
    borderRadius: width * 0.3,
    width: width * 0.4,
  },
  lineMiddle: {
    aspectRatio: 1,
    height: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  lineMiddleImage: {
    aspectRatio: 1,
    height: "50%",
  },
  button: {
    width: width * 0.85,
    height: width * 0.13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: primary,
    borderRadius: width * 0.03,
  },
  buttonText: {
    color: thirtiary,
    fontFamily: "JosefinSans-SemiBold",
    marginBottom: Platform.OS === "ios" ? 0 : height * 0.005,
    fontSize: width * 0.04,
  },
});
