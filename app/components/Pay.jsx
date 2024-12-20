import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Pressable,
  Platform,
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
          <View style={styles.walletChildRightTopContainer}>
            <TouchableOpacity style={styles.walletChildElement}>
              <Image
                source={require("../assets/pictures/pay_add_amount.png")}
                style={styles.walletChildRightBottomElementImage}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletChildElement}>
              <Image
                source={require("../assets/pictures/pay_scan.png")}
                style={[styles.walletChildRightBottomElementImage ,{width : "50%"}]}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.walletChildRightBottomContainer}>
            <TouchableOpacity style={styles.walletChildElement}>
              <Image
                source={require("../assets/pictures/pay_transaction.png")}
                style={styles.walletChildRightBottomElementImage}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletChildElement}>
              <Image
                source={require("../assets/pictures/pay_add_amount.png")}
                style={styles.walletChildRightBottomElementImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomInnerContainer}></View>
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
    height: height * 0.3,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  payImageContainer: {
    height: "55%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.05,
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

  walletContainer: {
    height: height * 0.23,
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
    justifyContent: "space-evenly",
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
  walletChildRightTopContainer: {
    height: "50%",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  walletChildRightBottomContainer: {
    height: "50%",
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  walletChildElement: {
    height: "90%",
    aspectRatio: 1,
    backgroundColor: secondary,
    borderRadius: width * 0.05,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  walletChildRightBottomElement: {
    height: "90%",
    width: "100%",
    borderRadius: height * 0.02,
    backgroundColor: secondary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  walletChildRightBottomElementImage: {
    width: "50%",
    aspectRatio: 1,
    resizeMode: "contain",
  },
  bottomContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  bottomInnerContainer: {
    height: "90%",
    width: "90%",
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "",
  },
});
