import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  primary,
  secondary,
  thirtiary,
  secondaryAcent,
} from "../utilities/color";
import { useState } from "react";
import { useRoute } from "@react-navigation/native";

const { height, width } = Dimensions.get("screen");
export default function Pay() {
  const [balance, setBalance] = useState(1200);

  const [nfc, setNfc] = useState(true);
  return (
    <View style={styles.container}>
      <View style={styles.pay}>
        <TouchableOpacity
          style={styles.payImageContainer}
          onPress={() => setNfc(!nfc)}
        >
          <Image
            source={require("../assets/pictures/tap_to_pay.png")}
            style={[
              styles.payImage,
              { tintColor: thirtiary },
              { opacity: nfc ? 1 : 0.4 },
            ]}
          />
        </TouchableOpacity>

        <Text style={styles.payText}>{!nfc ? "Turn On NFC" : " "}</Text>
        <TouchableOpacity style={styles.payQr}>
          <Image
            source={require("../assets/pictures/pay_scan.png")}
            resizeMethod="contain"
            style={styles.payQrImg}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.walletContainer}>
        <View style={styles.walletChildContainer}>
          <Image
            style={styles.walletBalanceImage}
            source={require("../assets/pictures/pay_wallet.png")}
          />
          <Text style={styles.walletBalanceText}>BALANCE</Text>
          <Text style={styles.walletBalanceContent}> Rs. {balance}</Text>
        </View>
        <View style={styles.walletChildRightContainer}>
          <View style={styles.walletChildRightTop} >

          </View>
          <View style={styles.walletChildRightBottomContainer}>

          </View>
        </View>
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
  payImageContainer: {
    height: "40%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  payImage: {
    height: "100%",
    resizeMode: "contain",
  },
  payText: {
    color: thirtiary,
    fontFamily: "Poppins-SemiBold",
    fontSize: width * 0.04,
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
  payQrImg: {
    height: "50%",
    aspectRatio: 1,
    tintColor: thirtiary,
    opacity: 0.7,
  },
  walletContainer: {
    height: height * 0.25,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  walletChildContainer: {
    height: "85%",
    width: "43%",
    backgroundColor: secondary,
    borderRadius: width * 0.04,
    position: "relative",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  walletChildRightContainer: {
    height: "85%",
    width: "43%",
    position: "relative",
    flexDirection: "column",
    alignItems: "center",
    justifyContent : "space-evenly"
  },
  walletBalanceImage: {
    height: "50%",
    aspectRatio: 1,
  },
  walletBalanceText: {
    color: thirtiary,
    fontFamily: "JosefinSans-Bold",
    fontSize: width * 0.05,
  },
  walletBalanceContent: {
    color: "#D59F0A",
    fontFamily: "Poppins-SemiBold",
    fontSize: width * 0.045,
  },
  walletChildRightTop : {
    height : "50%",
    width : "100%",
    backgroundColor : primary
  },
  walletChildRightBottomContainer : {
    height : "50%",
    width : "100%",
    backgroundColor : secondary
  }
  
});
