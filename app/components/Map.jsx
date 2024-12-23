import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Image,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import io from "socket.io-client";
import useCustomFonts from "../utilities/loadFonts.js"; // assuming you have a custom fonts utility

import { primary, secondary, thirtiary } from "../utilities/color"; // assuming you have a color utility
import Wallet from "./wallet.jsx"; // assuming you have a Wallet component

const { height, width } = Dimensions.get("screen");

const SOCKET_URL = "ws://192.168.1.2:5000";

console.log(MapView);
console.log(Marker);
console.log(Wallet);
console.log(useCustomFonts);

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pinLocation, setPinLocation] = useState(true);
  const [isSatellite, setIsSatellite] = useState(false);
  const [nearbyStops, setNearbyStops] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [amount, setAmount] = useState(1200);
  const [markerIcon, setMarkerIcon] = useState(null); // State for marker icon

  const mapRef = useRef();
  const socket = useRef(null);

  const fontsLoaded = useCustomFonts();
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData.coords);
      setLoading(false);

      // Send user location to backend
      if (socket.current) {
        socket.current.emit("getNearbyStops", locationData.coords);
      }
    })();
  }, []);
  useEffect(() => {
    const updatedIcon =
      zoomLevel > 11
        ? require("../assets/pictures/farMarker.png")
        : require("../assets/pictures/nearMarker.png");

    setMarkerIcon(updatedIcon);
  }, [zoomLevel]);

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(SOCKET_URL);

    // Listen for nearby bus stops from the backend
    socket.current.on("nearbyStops", (stops) => {
      setNearbyStops(stops);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  const customMapStyle = [
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "administrative",
      stylers: [{ visibility: "off" }],
    },
  ];

  const region = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : null;

  const handlePinLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        500
      );
    }
    setPinLocation(true);
  };

  const handleRegionChange = () => {
    setPinLocation(false);
  };
  const calculateZoomLevel = (region) => {
    const zoom = Math.log2(360 / region.latitudeDelta);
    console.log("Calculated Zoom Level:", Math.round(zoom));
    setZoomLevel(Math.round(zoom));
  };

  const handleRegionChangeComplete = (region) => {
    calculateZoomLevel(region);
    setPinLocation(false);
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          followsUserLocation={pinLocation ? true : false}
          onPanDrag={handleRegionChange}
          showsMyLocationButton={false}
          customMapStyle={customMapStyle}
          onRegionChangeComplete={handleRegionChangeComplete}
          mapType={isSatellite ? "satellite" : "standard"}
        >
          {nearbyStops.map((stop, index) => (
            <Marker
              key={`${index}-${zoomLevel}`}
              coordinate={{
                latitude: stop.coordinates[1],
                longitude: stop.coordinates[0],
              }}
              title={stop.name}
              description={stop.district}
              anchor={{ x: 0, y: 0 }} 
            >
              <Image
                source={markerIcon}
                style={{ resizeMode : "contain" , height : zoomLevel > 11 ? 20 : 5 , aspectRatio : 1 }}
                resizeMode="contain"
              />
            </Marker>
          ))}
        </MapView>
      )}

      <TouchableOpacity
        style={styles.locationButton}
        onPress={handlePinLocation}
      >
        <Image
          source={require("../assets/pictures/location.png")}
          resizeMode="contain"
          style={[
            styles.locaitonImg,
            { tintColor: pinLocation ? primary : secondary },
          ]}
        ></Image>
      </TouchableOpacity>
      <View style={styles.topContainer}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.leftContainerButton}>
            <Image
              source={require("../assets/pictures/profile.png")}
              style={styles.leftContainerButtonImg}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.leftContainerButton}>
            <Image
              source={require("../assets/pictures/favourite.png")}
              style={styles.leftContainerButtonImg}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.leftContainerButton}>
            <Image
              source={require("../assets/pictures/busStop.png")}
              style={styles.leftContainerButtonImg}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.rightContainer}>
          <View style={styles.rightInnerContainer}>
            <Image
              source={require("../assets/pictures/search.png")}
              resizeMode="contain"
              style={[styles.searchImg, { tintColor: "#00ADB5" }]}
            />
            <Text style={styles.searchText}>Search...</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.rightButtonContainer}>
        <TouchableOpacity
          style={[
            styles.rightButton,
            { backgroundColor: isSatellite ? primary : "white" },
          ]}
          onPress={() => setIsSatellite(!isSatellite)}
        >
          <Image
            source={require("../assets/pictures/layers.png")}
            style={[
              styles.rightButtonImg,
              { tintColor: isSatellite ? "white" : secondary },
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.walletContainer}>
        <Wallet amount={amount} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  map: {
    height: "100%",
    width: "100%",
  },
  locationButton: {
    height: height * 0.06,
    aspectRatio: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    borderRadius: 10000,
    right: 20,
    bottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  locaitonImg: {
    height: "30%",
    aspectRatio: 1,
    marginTop: "3%",
    marginRight: "2%",
  },
  topContainer: {
    height: height * 0.04,
    width: width * 0.9,
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: height * 0.04,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    flexDirection: "row",
  },
  leftContainer: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: width * 0.03,
  },
  leftContainerButton: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 1000,
  },
  leftContainerButtonImg: {
    height: "100%",
    width: "100%",
  },
  rightContainer: {
    width: "35%",
    height: "100%",
  },
  rightInnerContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    borderRadius: 1000,
    alignItems: "center",
    backgroundColor: "white",
  },
  searchImg: {
    width: "20%",
    aspectRatio: 1,
    marginLeft: "10%",
  },
  searchText: {
    fontSize: width * 0.03,
    fontFamily: "Poppins-Regular",
    color: secondary,
    opacity: 0.8,
    marginTop: Platform.OS === "ios" ? "0.5%" : "2.5%",
    marginLeft: "8%",
  },
  rightButtonContainer: {
    width: height * 0.04,
    top: height * 0.09,
    flexDirection: "column",
    gap: height * 0.01,
    right: width * 0.05,
    position: "absolute",
  },
  rightButton: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 1000,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  rightButtonImg: {
    height: "50%",
  },
  walletContainer: {
    position: "absolute",
    bottom: height * 0.015,
    left: width * 0.05,
  },
});
