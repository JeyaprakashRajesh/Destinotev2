import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { primary, secondary } from "../utilities/color";

const { height, width } = Dimensions.get("screen");

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pinLocation, setPinLocation] = useState(true);
  const mapRef = useRef();

  useEffect(() => {
    if (pinLocation && location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,  
          longitudeDelta: 0.05,
        },
        500 
      );
    }
  }, [pinLocation]);

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
    })();
  }, []);

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

  const region = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : null;

    const handlePinLocation = () => {
        setPinLocation(true)
    }

    const handleRegionChange = () => {
        setPinLocation(false)
    }

    return (
    <View style={styles.container}>
      {location && (
        <MapView
        ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation={false}
          followsUserLocation={true}
          showsCompass={false}
          onPanDrag={handleRegionChange}
        ></MapView>
      )}

      <TouchableOpacity
        style={styles.locationButton}
        onPress={handlePinLocation}
      >
        <Image
          source={require("../assets/pictures/location.png")}
          resizeMode="contain"
          style={[styles.locaitonImg , {tintColor : pinLocation ? primary : secondary}]}
          
        ></Image>
      </TouchableOpacity>
      <View style={styles.topContainer}>
        <View style={styles.leftContainer}> 
            
        </View>
        <TouchableOpacity style={styles.rightContainer}>
          <Image 
            source={require("../assets/pictures/search.png")}
            resizeMode="contain"
            style={[styles.searchImg , {tintColor : primary}]}
          />
          <Text style={styles.searchText}>Search...</Text>
        </TouchableOpacity>
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
    marginTop : "3%",
    marginRight : "2%",
  },
  topContainer : {
    height: height * 0.04,
    width : width * 0.9,
    alignItems: "center",
    justifyContent : "space-between",
    position: "absolute",
    top: height * 0.04,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    flexDirection : "row",
  },
  leftContainer : {
    
  },
  rightContainer : {
    width : "35%",
    height : "100%",
    flexDirection : "row",
    borderRadius : 1000,
    alignItems : "center",
    backgroundColor : "white"
  },
  searchImg: {
    width : "20%",
    aspectRatio : 1,
  },
  searchText : {
    fontSize : width * 0.04
  }
});
