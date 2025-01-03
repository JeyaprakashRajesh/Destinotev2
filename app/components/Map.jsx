import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  Animated,
} from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";

import MapViewCluster from "react-native-map-clustering";
import * as Location from "expo-location";
import io from "socket.io-client";
import useCustomFonts from "../utilities/loadFonts.js";
import { debounce, throttle } from "lodash";

import { primary, secondary, thirtiary } from "../utilities/color";
import Wallet from "./wallet.jsx";

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
  const [selectedStop, setSelectedStop] = useState(null);
  const [isMarkerSelected, setIsMarkerSelected] = useState(false);
  const [bus, setBus] = useState([]);
  const blue = "#034694";
  const red = "#B22222";

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
      if (socket.current) {
        socket.current.emit("getNearbyStops", locationData.coords);
      }
    })();
  }, []);

  useEffect(() => {
    socket.current = io(SOCKET_URL);
    socket.current.on("nearbyStops", (stops) => {
      console.log("Received nearby stops:", stops);
      setNearbyStops(stops);
    });

    socket.current.on("busLocations", (busLocations) => {
      console.log("Received bus locations:", busLocations);
      setBus(busLocations);
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
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "transit",
      stylers: [
        {
          visibility: "off",
        },
      ],
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
    setPinLocation((prev) => !prev);
  };

  const throttledHandleRegionChange = throttle(() => {
    setPinLocation(false);
  }, 500);

  const handleRegionChange = throttledHandleRegionChange;

  const handleMarkerPress = (stop) => {
    if (selectedStop && selectedStop.id === stop.id) {
      setSelectedStop(null);
      setIsMarkerSelected(false);
    } else {
      setSelectedStop(stop);
      setIsMarkerSelected(true);
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: stop.coordinates[1],
            longitude: stop.coordinates[0],
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          500
        );
      }
    }
  };
  const renderBusMarkers = () => {
    const calculateBearing = (prev, current) => {
      console.log(prev, current);
      if (!prev || !current) return 0;

      const toRadians = (degree) => (degree * Math.PI) / 180;
      const toDegrees = (radian) => (radian * 180) / Math.PI;

      const lat1 = toRadians(prev[1]);
      const lon1 = toRadians(prev[0]);
      const lat2 = toRadians(current[1]);
      const lon2 = toRadians(current[0]);

      const dLon = lon2 - lon1;

      const x = Math.sin(dLon) * Math.cos(lat2);
      const y =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

      let bearing = toDegrees(Math.atan2(x, y));
      return (bearing + 360) % 360;
    };

    return bus.map((bus) => {
      const currentCoordinates = {
        latitude: bus.busCoordinates[1],
        longitude: bus.busCoordinates[0],
      };

      const rotation = calculateBearing(
        bus.previousCoordinates,
        bus.busCoordinates
      );

      return (
        <Marker
          key={bus.VehicleNo}
          coordinate={currentCoordinates}
          cluster={false}
          stopPropagation={true}
          icon={
            bus.busType === "State Bus"
              ? require("../assets/pictures/bus-blue.png")
              : require("../assets/pictures/bus-red.png")
          }
          rotation={rotation} 
          anchor={{ x: 0.5, y: 0.5 }} 
        />
      );
    });
  };

  const renderMarkers = () => {
    return nearbyStops.map((stop, index) => {
      if (stop.type !== "bus") {
        return (
          <Marker
            key={`${index}`}
            coordinate={{
              latitude: stop.coordinates[1],
              longitude: stop.coordinates[0],
            }}
            cluster={stop.type === "stop" ? true : false}
            onPress={() => handleMarkerPress(stop)}
            stopPropagation={true}
            icon={getMarkerIcon(stop)}
          />
        );
      }
      return null;
    });
  };
  const getMarkerIcon = (stop) => {
    return stop.type === "stop"
      ? require("../assets/pictures/farMarkerRed.png")
      : require("../assets/pictures/farMarkerBlue.png");
  };

  const StopDetails = React.memo(({ selectedStop }) => {
    if (!selectedStop) return null;

    return (
      <View
        style={[
          styles.stopDetailsContainer,
          {
            backgroundColor: selectedStop.type === "terminal" ? blue : red,
          },
        ]}
      >
        <View>
          <Text style={styles.stopDetailsName}>{selectedStop.name}</Text>
          <Text style={styles.stopDetailsType}>
            {selectedStop.type === "terminal" ? "Terminal" : "Stop"}
          </Text>
          <Text style={styles.stopDetailsDescription}>
            {selectedStop.stopNo},{" "}
            {!selectedStop.state ? "Tamil Nadu" : selectedStop.state}
          </Text>
        </View>
        <TouchableOpacity style={[styles.stopDetailsButton, { right: 10 }]}>
          <Image
            source={require("../assets/pictures/directions.png")}
            style={[
              styles.stopDetailsButtonImg,
              { tintColor: selectedStop.type === "terminal" ? blue : red },
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.stopDetailsButton, { right: 60 }]}>
          <Image
            source={require("../assets/pictures/share.png")}
            style={[
              styles.stopDetailsButtonImg,
              { tintColor: selectedStop.type === "terminal" ? blue : red },
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.stopDetailsButton, { right: 110 }]}>
          <Image
            source={require("../assets/pictures/report.png")}
            style={[
              styles.stopDetailsButtonImg,
              { tintColor: selectedStop.type === "terminal" ? blue : red },
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  });
  return (
    <View style={styles.container}>
      {location && (
        <MapViewCluster
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          followsUserLocation={pinLocation ? true : false}
          onPanDrag={handleRegionChange}
          showsMyLocationButton={false}
          customMapStyle={customMapStyle}
          provider={PROVIDER_GOOGLE}
          mapType={isSatellite ? "satellite" : "standard"}
          radius={8}
          rotateEnabled={false}
          onPress={() => {
            setSelectedStop(null);
            setIsMarkerSelected(false);
          }}
          renderCluster={(cluster) => {
            const { id, geometry, onPress } = cluster;
            return (
              <Marker
                key={`cluster-${id}`}
                coordinate={{
                  longitude: geometry.coordinates[0],
                  latitude: geometry.coordinates[1],
                }}
                onPress={onPress}
              >
                <View style={styles.markerCluster}></View>
              </Marker>
            );
          }}
          maxZoomLevel={20}
          minZoomLevel={2}
        >
          {renderMarkers()}
          {renderBusMarkers()}
        </MapViewCluster>
      )}
      {isMarkerSelected && <StopDetails selectedStop={selectedStop} />}

      <TouchableOpacity
        style={[styles.locationButton, { bottom: isMarkerSelected ? 170 : 20 }]}
        onPress={handlePinLocation}
      >
        <Image
          source={require("../assets/pictures/location.png")}
          resizeMode="contain"
          style={[
            styles.locaitonImg,
            { tintColor: pinLocation ? primary : secondary },
          ]}
        />
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
  stopDetailsContainer: {
    height: 150,
    position: "absolute",
    width: width * 0.95,
    bottom: 10,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  stopDetailsName: {
    fontFamily: "Montserrat-SemiBold",
    color: "white",
    fontSize: width * 0.06,
  },
  stopDetailsType: {
    fontFamily: "Montserrat-Regular",
    color: "white",
    fontSize: 13,
  },
  stopDetailsDescription: {
    fontFamily: "Montserrat-Regular",
    color: "white",
    fontSize: 13,
  },
  stopDetailsButton: {
    height: 40,
    width: 40,
    backgroundColor: "white",
    borderRadius: 1000,
    position: "absolute",
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stopDetailsButtonImg: {
    height: "60%",
    aspectRatio: 1,
    opacity: 0.9,
  },
  markerCluster: {
    height: 8,
    aspectRatio: 1,
    borderRadius: 1000,
    backgroundColor: primary,
    borderColor: secondary,
    borderWidth: 2,
  },
});
