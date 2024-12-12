import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import {
  primary,
  secondary,
  thirtiary,
  secondaryAcent,
} from "../utilities/color";
import { useState } from "react";

const { height, width } = Dimensions.get("screen");
export default function Pay() {
  const [nfc, setNfc] = useState(true);
  return (
    <View style={styles.container}>
      <View style={styles.pay}>
        <Image
          source={require("../assets/pictures/tap_to_pay.png")}
          style={[
            styles.payImage,
            { tintColor: thirtiary },
            { opacity: nfc ? 1 : 0.4 },
          ]}
        />

        <Text style={styles.payText}>{!nfc ? "Turn On NFC" : null}</Text>
        <TouchableOpacity style={styles.payQr}> 
          <Image 
            source={require("../assets/pictures/pay_scan.png")}
            resizeMethod="contain"
            style={styles.payQrImg}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: secondaryAcent,
    alignItems: "center",
  },
  pay: {
    height: height * 0.4,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  payImage: {
    height: "40%",
    resizeMode: "contain",
  },
  payText: {
    color : thirtiary,
    fontFamily : "Poppins-SemiBold",
    fontSize : width * 0.04,
  },
  payQr: {
    width: "14%",
    aspectRatio: 1,
    position: "absolute",
    bottom: 20, 
    right: 20,
    backgroundColor: secondary, 
    justifyContent: "center", 
    alignItems: "center", 
    borderRadius: 100, 
  },
  payQrImg : {
    
  }

});
