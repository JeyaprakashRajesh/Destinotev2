import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import {
  primary,
  secondary,
  secondaryAcent,
  thirtiary,
} from "../utilities/color";

const { height, width } = Dimensions.get("screen");

export default function GetStarted({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x; // Get the horizontal scroll position
    const index = Math.round(scrollX / width); // Calculate the current index
    setCurrentIndex(index); // Update the current index state
  };
  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {listData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: currentIndex === index ? primary : thirtiary },
            ]}
          />
        ))}
      </View>
    );
  };
  const listData = [
    {
      image: require("../assets/pictures/getStartedLocation.png"),
      title: "BUS TRACKING",
      subTitle:
        "Tracks all the available buses and shares live location feed to the user",
    },
    {
      image: require("../assets/pictures/getStartedWallet.png"),
      title: "WALLET",
      subTitle: "A Wallet where the user can instantly pay any bus ticket",
    },
    {
      image: require("../assets/pictures/getStartedPay.png"),
      title: "TAP N PAY",
      subTitle: "Use the Built-in NFC to Tap N Pay your bus fare.",
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.listItemContainer}>
      <View style={styles.listItemInnerContainer}>
        <View style={styles.listLeftSection}>
          <Image
            style={styles.listLeftSectionImage}
            source={item.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.listRightSection}>
          <View style={styles.listRightSectionHeading}>
            <Text style={styles.listRightSectionHeadingText}>{item.title}</Text>
          </View>
          <View style={styles.listRightSectionSubHeading}>
            <Text style={styles.listRightSectionSubHeadingText}>
              {item.subTitle}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  function handleGetStarted() {
    navigation.navigate("Phone");
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={secondary} />
      <View style={styles.innerContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../assets/pictures/destinote-getstarted.png")}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headingContainer}>
          <Text numberOfLines={1} style={styles.headingText}>
            DESTINOTE
          </Text>
        </View>
        <View style={styles.subHeadingContainer}>
          <Text style={styles.subHeadingText}>
            <Text style={{ color: primary }}>Guiding</Text> you, one step closer
            to your <Text style={{ color: primary }}>Destination</Text>
          </Text>
        </View>
        <View
          style={[styles.listContainer]}
        >
          <FlatList
            data={listData}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingVertical: 0,
            }}
            
          />
        <View>{renderDots()}</View>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>GET STARTED</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: secondary,
    alignItems: "center",
  },
  innerContainer: {
    height: height * 1.0,
    width: width * 1.0,
  },
  imageContainer: {
    height: height * 0.38,
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: "85%",
    width: "100%",
  },
  headingContainer: {
    height: height * 0.08,
    width: width,
    marginTop: height * 0.01,
    alignItems: "center",
    justifyContent: "center",
  },
  headingText: {
    fontFamily: "JosefinSans-SemiBold",
    fontSize: width * 0.09,
    color: thirtiary,
    letterSpacing: 2,
  },
  subHeadingContainer: {
    height: height * 0.12,
    width: width,
    marginTop: height * 0.01,
    alignItems: "center",
    justifyContent: "center",
  },
  subHeadingText: {
    fontSize: width * 0.065,
    fontFamily: "JosefinSans-Medium",
    width: "90%",
    textAlign: "center",
    color: thirtiary,
  },
  listContainer: {
    marginTop: height * 0.01,
    height: height * 0.18,
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },
  listItemContainer: {
    height: "100%",
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },
  listLeftSection: {
    height: "100%",
    width: "20%",
    borderColor: thirtiary,
    borderStyle: "solid",
    borderWidth: width * 0.008,
    borderRadius: width * 0.045,
    alignItems: "center",
    justifyContent: "center",
  },
  listLeftSectionImage: {
    width: "60%",
  },
  listItemInnerContainer: {
    height: "80%",
    width: "80%",
    flexDirection: "row",
    margin: 0, 
    padding: 0, 
  },
  listRightSection: {
    width: "78%",
    flexDirection: "column",
    height: "90%",
    marginLeft: "2%",
  },
  listRightSectionHeading: {
    height: "40%",
    width: "100%",
  },
  listRightSectionSubHeading: {
    height: "60%",
    width: "100%",
  },
  listRightSectionHeadingText: {
    color: primary,
    fontFamily: "JosefinSans-Medium",
    fontSize: width * 0.06,
  },
  listRightSectionSubHeadingText: {
    color: thirtiary,
    fontFamily: "Poppins-Regular",
    fontSize: width * 0.035,
  },
  buttonContainer: {
    width: width,
    marginTop: height * 0.01,
    justifyContent: "center",
    alignItems: "center",
    flex : 1,
    paddingBottom : Platform.OS === "ios" ? height * 0.02: 0
  },
  button: {
    height: height * 0.07,
    width: "70%",
    backgroundColor: primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    marginBottom: "10%",
  },
  buttonText: {
    color: thirtiary,
    fontFamily: "JosefinSans-SemiBold",
    marginBottom: Platform.OS === "ios" ? 0 : height * 0.005,
    fontSize: width * 0.04,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: height * 0.01,
  },
  dot: {
    height: height * 0.008,
    width: height * 0.008,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
