import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  secondary,
  thirtiary,
  secondaryAcent,
} from "../../../utilities/color";
import { useState } from "react";

const { height, width } = Dimensions.get("screen");
export default function Pay() {
  const [balance, setBalance] = useState(1200);
  const [monthlyOutflow, setMonthlyOutflow] = useState(1260);

  const [nfc, setNfc] = useState(true);
  return (
    <View style={styles.container}>
      <View style={styles.pay}>
        <TouchableOpacity
          style={styles.payImageContainer}
          onPress={() => setNfc(!nfc)}
        >
          <Image
            source={require("../../../assets/pictures/tap_to_pay.png")}
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
            source={require("../../../assets/pictures/pay_wallet.png")}
          />
          <Text style={styles.walletBalanceText}>BALANCE</Text>
          <Text style={styles.walletBalanceContent}> Rs. {balance}</Text>
        </View>
        <View style={styles.walletChildRightContainer}>
          <View style={styles.walletChildRightTopContainer}>
            <TouchableOpacity style={styles.walletChildElement}>
              <Image
                source={require("../../../assets/pictures/wallet.png")}
                style={styles.walletChildRightBottomElementImage}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletChildElement}>
              <Image
                source={require("../../../assets/pictures/transaction.png")}
                style={styles.walletChildRightBottomElementImage}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.walletChildRightBottomContainer}>
            <TouchableOpacity style={styles.walletChildElement}>
            <Image
                source={require("../../../assets/pictures/headset.png")}
                style={[
                  styles.walletChildRightBottomElementImage,
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletChildElement}>
              <Image
                source={require("../../../assets/pictures/qr-code.png")}
                style={[styles.walletChildRightBottomElementImage]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomMonthySpendingContainer}>
          <View style={styles.bottomMonthySpendingTextContainer}>
            <Text style={styles.bottomMonthySpendingText}>Monthly outflow</Text>
            <Image
              source={require("../../../assets/pictures/line-chart.png")}
              resizeMode="contain"
              style={styles.bottomMonthySpendingImage}
            />
          </View>
          <View style={styles.bottomMonthySpendingContentContainer}>
            <Text style={styles.bottomMonthySpendingContentText}>
              Rs. {monthlyOutflow}
            </Text>
          </View>
        </View>
        <View style={styles.bottomBottomContainer}>
          <View style={styles.bottomBottomInnerContainer}>
            <View style={styles.bottomBottomInnerContainerContent}>
              <Image
                style={styles.bottomBottomInnerContainerContentImage}
                resizeMode="contain"
                source={require("../../../assets/pictures/pay_distance.png")}
              />
              <Text style={styles.bottomBottomInnerContainerContentText}>
                14 KM
              </Text>
            </View>
            <View style={styles.bottomBottomInnerContainerTextContainer}>
              <Text style={styles.bottomBottomInnerContainerText}>
                Monthly travel
              </Text>
            </View>
          </View>
          <View style={styles.bottomBottomInnerContainer}>
            <View style={styles.bottomBottomInnerContainerContent}>
            <Image
                style={styles.bottomBottomInnerContainerContentImage}
                resizeMode="contain"
                source={require("../../../assets/pictures/co2.png")}
              />
              <Text style={styles.bottomBottomInnerContainerContentText}>
                420 PPM
              </Text>
            </View>
            <View style={styles.bottomBottomInnerContainerTextContainer}>
              <Text style={styles.bottomBottomInnerContainerText}>
                C02 LEVEL
              </Text>
            </View>
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
    width: "42%",
    aspectRatio: 1,
    resizeMode: "contain",
  },
  bottomContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  bottomMonthySpendingContainer: {
    height: "30%",
    width: "90%",
    backgroundColor: secondary,
    borderRadius: width * 0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomMonthySpendingTextContainer: {
    marginLeft: "5%",
    flexDirection: "row",
    alignItems: "center",
  },
  bottomMonthySpendingText: {
    color: thirtiary,
    fontFamily: "Poppins-SemiBold",
    fontSize: width * 0.04,
  },
  bottomMonthySpendingImage: {
    width: "17%",
    aspectRatio: 1,
    marginLeft: width * 0.03,
  },
  bottomMonthySpendingContentContainer: {
    marginRight: width * 0.05,
  },
  bottomMonthySpendingContentText: {
    color: "#D59F0A",
    fontFamily: "Poppins-SemiBold",
    fontSize: width * 0.045,
  },
  bottomBottomContainer: {
    height: "65%",
    width: "90%",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  bottomBottomInnerContainer: {
    height: "95%",
    width: "47.5%",
    backgroundColor: secondary,
    borderRadius: width * 0.05,
  },
  bottomBottomInnerContainerContent: {
    height: "60%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: "10%",
  },
  bottomBottomInnerContainerTextContainer: {
    height: "25%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "5%",
  },
  bottomBottomInnerContainerText: {
    width: "90%",
    textAlign: "center",
    color: thirtiary,
    fontFamily: "Poppins-SemiBold",
    fontSize: width * 0.04,
  },
  bottomBottomInnerContainerContentImage: {
    height: "40%",
    aspectRatio: 1,
  },
  bottomBottomInnerContainerContentText: {
    color: thirtiary,
    fontFamily: "Poppins-SemiBold",
    fontSize: width * 0.05,
    backgroundColor: "none",
    marginTop: "5%",
    marginLeft: "3%",
  },
});
