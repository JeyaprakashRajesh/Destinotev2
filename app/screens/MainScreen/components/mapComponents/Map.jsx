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
} from "react-native";
import {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Polyline,
} from "react-native-maps";

import MapViewCluster from "react-native-map-clustering";
import * as Location from "expo-location";
import io from "socket.io-client";
import useCustomFonts from "../../../../utilities/loadFonts.js";
import { debounce, throttle } from "lodash";

import RenderMarkers from "./renderMarkers.jsx";
import RenderBusMarkers from "./RenderBusMarkers.jsx";
import StopDetails from "./StopDetails.jsx";

import { primary, secondary, thirtiary } from "../../../../utilities/color.js";
import { customMapStyle } from "./MapUtils.jsx";
import BusDetails from "./BusDetails.jsx";
import { useNavigation } from "@react-navigation/native";
const { height, width } = Dimensions.get("screen");

import { BACKEND_URL , SOCKET_URL } from "../../../../utilities/routes.js";

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pinLocation, setPinLocation] = useState(true);
  const [isSatellite, setIsSatellite] = useState(false);
  const [nearbyStops, setNearbyStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [isMarkerSelected, setIsMarkerSelected] = useState(false);
  const [arrivalStatus, setArrivalStatus] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [stopCoordinates, setStopCoordinates] = useState(null);
  const [bus, setBus] = useState([]);
  const [selectedBusMarker, setSelectedBusMarker] = useState(null)
  const navigation = useNavigation();



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
      setNearbyStops(stops);
    });

    socket.current.on("busLocations", (busLocations) => {
      setBus(busLocations);
    });
    return () => {
      socket.current.disconnect();
    };
  }, []);
  useEffect(() => {
    if (mapRef.current && selectedBus && stopCoordinates) {
      if (
        stopCoordinates.length === 2 &&
        selectedBus.length === 2 &&
        typeof stopCoordinates[0] === "number" &&
        typeof stopCoordinates[1] === "number" &&
        typeof selectedBus[0] === "number" &&
        typeof selectedBus[1] === "number"
      ) {
        mapRef.current.fitToCoordinates(
          [
            { latitude: stopCoordinates[1], longitude: stopCoordinates[0] },
            { latitude: selectedBus[1], longitude: selectedBus[0] },
          ],
          {
            edgePadding: {
              top: height * 0.2,
              right: 50,
              bottom: height * 0.2,
              left: 50,
            },
            animated: true,
          }
        );
      } else {
      }
    }
  }, [selectedBus, stopCoordinates]);
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

      if (mapRef.current && stopCoordinates) {
        mapRef.current.animateToRegion(
          {
            latitude: stop.coordinates[1],
            longitude: stop.coordinates[0],
          });


        const closestBusCoordinates = bus.reduce((closest, currentBus) => {
          const currentDistance = Math.sqrt(
            Math.pow(
              currentBus.busCoordinates[1] - stopCoordinates.latitude,
              2
            ) +
            Math.pow(
              currentBus.busCoordinates[0] - stopCoordinates.longitude,
              2
            )
          );

          return !closest || currentDistance < closest.distance
            ? {
              coordinates: currentBus.busCoordinates,
              distance: currentDistance,
            }
            : closest;
        }, null)?.coordinates;

        if (closestBusCoordinates) {
          const midpoint = {
            latitude:
              (stopCoordinates.latitude + closestBusCoordinates[1]) / 2,
            longitude:
              (stopCoordinates.longitude + closestBusCoordinates[0]) / 2,
          };

          // Adjust zoom level
          const zoomDelta = {
            latitudeDelta:
              Math.abs(stopCoordinates.latitude - closestBusCoordinates[1]) *
              2, // Slightly farther
            longitudeDelta:
              Math.abs(stopCoordinates.longitude - closestBusCoordinates[0]) *
              2, // Slightly farther
          };

          mapRef.current.animateToRegion(
            {
              ...midpoint,
              ...zoomDelta,
            },
            500
          );
        }
      }
    }
  }
    ;

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
          provider={Platform.OS === "ios" ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
          mapType={isSatellite ? "satellite" : "standard"}
          radius={8}
          rotateEnabled={false}
          onPress={() => {
            setIsMarkerSelected(false);
            setSelectedBus(null);
            setSelectedStop(null);
            setSelectedBusMarker(null)
            setStopCoordinates(null);
          }}
          renderCluster={(cluster) => {
            const { id, geometry } = cluster;
            return (
              <Marker
                key={`cluster-${id}`}
                coordinate={{
                  longitude: geometry.coordinates[0],
                  latitude: geometry.coordinates[1],
                }}
                // Disable the callout
                calloutAnchor={{ x: 0, y: 0 }} // Prevents the callout from appearing
                onPress={(e) => e.stopPropagation()} // Prevent default behavior on press
              >
                <View style={styles.markerCluster}></View>
              </Marker>
            );
          }}
          maxZoomLevel={20}
          minZoomLevel={2}
        >
          <RenderMarkers
            nearbyStops={nearbyStops}
            handleMarkerPress={handleMarkerPress}
          />
          <RenderBusMarkers bus={bus} setSelectedBusMarker={setSelectedBusMarker} />
          {isMarkerSelected && selectedBus && stopCoordinates && (
            <Polyline
              coordinates={[
                { latitude: stopCoordinates[1], longitude: stopCoordinates[0] },
                { latitude: selectedBus[1], longitude: selectedBus[0] },
              ]}
              strokeColor={secondary}
              strokeWidth={4}
              lineDashPattern={[10, 3]}
            />



          )}
        </MapViewCluster>
      )}
      {isMarkerSelected && (
        <StopDetails
          selectedStop={selectedStop}
          arrivalStatus={arrivalStatus}
          setArrivalStatus={setArrivalStatus}
          backendURL={BACKEND_URL}
          setSelectedBus={setSelectedBus}
          setStopCoordinates={setStopCoordinates}
        />
      )}
      {selectedBusMarker && (
        <BusDetails selectedBusMarker={selectedBusMarker} />
      )}

      <TouchableOpacity
        style={[styles.locationButton, { bottom: isMarkerSelected || selectedBusMarker ? 190 : 20 }]}
        onPress={handlePinLocation}
      >
        <Image
          source={require("../../../../assets/pictures/location.png")}
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
              source={require("../../../../assets/pictures/profile.png")}
              style={styles.leftContainerButtonImg}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.leftContainerButton}>
            <Image
              source={require("../../../../assets/pictures/favourite.png")}
              style={styles.leftContainerButtonImg}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.leftContainerButton}>
            <Image
              source={require("../../../../assets/pictures/busStop.png")}
              style={styles.leftContainerButtonImg}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.rightContainer}
          onPress={() => navigation.navigate("Search")}
        >
          <View style={styles.rightInnerContainer}>
            <Image
              source={require("../../../../assets/pictures/search.png")}
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
            source={require("../../../../assets/pictures/layers.png")}
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

  markerCluster: {
    height: 8,
    aspectRatio: 1,
    borderRadius: 1000,
    backgroundColor: primary,
    borderColor: secondary,
    borderWidth: 2,
  },
});
