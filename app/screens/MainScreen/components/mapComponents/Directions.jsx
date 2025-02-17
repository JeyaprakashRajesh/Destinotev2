import React, { useState, useEffect , useRef} from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { primary, secondary, thirtiary } from "../../../../utilities/color.js";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Image, Platform } from 'react-native';
import * as Location from "expo-location";
import axios from 'axios';
import { Linking } from 'react-native';
import { customMapStyle } from './MapUtils.jsx';

const { height, width } = Dimensions.get("screen");
const red = "#B22222";
const GOOGLE_MAPS_API_KEY = "AIzaSyCKNpEG4Hee46llvZcOyTnz0ylW6T2AtRI"

export default function Directions({ navigation, direction, setDirection }) {
  const [isTracking, setTracking] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const mapRef = useRef(null);



  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(userCoords);

      if (direction?.coordinates) {
        fetchRoute(userCoords, {
          latitude: parseFloat(direction.coordinates[1]),
          longitude: parseFloat(direction.coordinates[0]),
        });
      }
    })();
  }, [direction]);
  useEffect(() => {
    if (userLocation && direction?.coordinates && mapRef.current) {
      const destination = {
        latitude: parseFloat(direction.coordinates[1]),
        longitude: parseFloat(direction.coordinates[0]),
      };
  
      mapRef.current.fitToCoordinates([userLocation, destination], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [userLocation, direction]);
  
  const fetchRoute = async (start, end) => {
    try {
      console.log(start , end)
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json`,
        {
          params: {
            origin: `${start.latitude},${start.longitude}`,
            destination: `${end.latitude},${end.longitude}`,
            mode: "driving", 
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (response.data.routes.length) {
        const points = response.data.routes[0].overview_polyline.points;
        const decodedCoords = decodePolyline(points);
        setRouteCoords(decodedCoords);
        console.log(decodedCoords)
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };
  const decodePolyline = (t) => {
    let points = [];
    let index = 0, len = t.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };
  const handleStartNavigation = () => {
    if (direction?.coordinates) {
      const destinationLat = parseFloat(direction.coordinates[1]);
      const destinationLng = parseFloat(direction.coordinates[0]);
      
      const url = Platform.select({
        ios: `maps://app?saddr=${userLocation.latitude},${userLocation.longitude}&daddr=${destinationLat},${destinationLng}&directionsmode=driving`,
        android: `google.navigation:q=${destinationLat},${destinationLng}&mode=d`
      });
  
      Linking.openURL(url).catch(err => console.error("An error occurred", err));
    }
  };


  const destination = direction?.coordinates
    ? {
      latitude: parseFloat(direction.coordinates[1]),
      longitude: parseFloat(direction.coordinates[0]),
    }
    : null;

  const initialRegion = {
    latitude: userLocation?.latitude || 37.78825,
    longitude: userLocation?.longitude || -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  if (!userLocation) {
    return <Text>Loading...</Text>
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView 
          ref={mapRef} 
          style={StyleSheet.absoluteFillObject} 
          showsMyLocationButton={false} 
          rotateEnabled={false} 
          showsUserLocation={true}
          customMapStyle={customMapStyle}
        >
          

          {destination && (
            <Marker
              coordinate={destination}
              title={direction.name}
              description="Destination"
              icon={direction.type === "terminal"? require("../../../../assets/pictures/farMarkerBlue.png"): require("../../../../assets/pictures/farMarkerRed.png")}
            />
          )}

          {/* {routeCoords.length > 0 && (
            <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor={"blue"} />
          )} */}

          {destination && (
            <Polyline 
              coordinates={[userLocation , destination]}
              strokeWidth={4} 
              strokeColor={secondary}
              geodesic={true}
              lineDashPattern={[13, 10]}
             />
          )}

        </MapView>
      </View>

      <View style={styles.detailsContainer}>
        {!isTracking ? (
          <View style={styles.noContainer}>
            <View style={styles.noLeft}>
              <View style={styles.noLeftDetails}>
                <Text style={styles.noLeftETA}>10min</Text>
                <Text style={styles.noLeftDistance}>(5km)</Text>
              </View>
              <TouchableOpacity style={styles.noStartButton} onPress={handleStartNavigation}>
                <Image
                  source={require("../../../../assets/pictures/navigate-start.png")}
                  style={styles.noStartImage}
                  resizeMode="contain"
                />
                <Text style={styles.noStartText}>START</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.noRight}>
              <View style={styles.noRightPlace}>
                <View style={styles.noRightElement}>
                  <View style={styles.noRightImageContainer}>
                    <Image
                      source={require("../../../../assets/pictures/location-pin.png")}
                      style={styles.noRightImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.noRightTextContainer}>
                    <Text style={[styles.noRightText, { color: primary }]}>Your Location</Text>
                  </View>
                </View>

                <View style={styles.noRightElement}>
                  <View style={styles.noRightImageContainer}>
                    <Image
                      source={direction.type === "terminal"
                        ? require("../../../../assets/pictures/farMarkerBlue.png")
                        : require("../../../../assets/pictures/farMarkerRed.png")
                      }
                      style={styles.noRightImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.noRightTextContainer}>
                    <Text style={[styles.noRightText, { color: secondary }]}>{direction.name}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.noRightButtons}>
                <TouchableOpacity style={[styles.noRightButton, { backgroundColor: secondary }]}>
                  <Image
                    source={require("../../../../assets/pictures/share.png")}
                    style={styles.noRightButtonImg}
                    resizeMode="contain"
                    tintColor={thirtiary}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.noRightButton, { backgroundColor: red }]} onPress={() => navigation.goBack()}>
                  <Image
                    source={require("../../../../assets/pictures/cancel.png")}
                    style={[styles.noRightButtonImg, { height: "40%" }]}
                    resizeMode="contain"
                    tintColor={thirtiary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { flex: 1, width: "100%" },
  detailsContainer: { height: "25%", width: "100%", backgroundColor: thirtiary },
  noContainer: { flex: 1, paddingHorizontal: "3%", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly" },
  noLeft: { height: "40%", width: "100%", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: "2%", alignItems: 'center', },
  noRight: { height: "60%", width: "100%", flexDirection: "row" },
  noLeftDetails: { flexDirection: "row", alignItems: 'center', },
  noLeftETA: { fontSize: width * 0.05, fontFamily: "Montserrat-SemiBold", color: primary },
  noLeftDistance: { fontSize: width * 0.04, fontFamily: "Montserrat-Medium", color: secondary, opacity: 0.5, marginLeft: width * 0.01 },
  noStartButton: { width: "35%", height: "60%", borderRadius: 15, backgroundColor: secondary, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  noStartImage: { width: "22%", aspectRatio: 1 },
  noStartText: { fontFamily: "Montserrat-SemiBold", color: thirtiary, fontSize: width * 0.04, marginLeft: "3%", marginTop: Platform.OS === "android" ? width * 0.005 : 0 },
  noRightPlace: { width: "85%", height: "100%", flexDirection: "column", justifyContent: "space-evenly" },
  noRightElement: { width: "95%", height: "40%", flexDirection: "row" },
  noRightImageContainer: { height: "100%", aspectRatio: 1, alignItems: 'center', justifyContent: 'center', },
  noRightImage: { height: "50%", aspectRatio: 1 },
  noRightTextContainer: { flex: 1, borderColor: "#b8b8b8", borderWidth: 4, flexDirection: "row", alignItems: "center", borderRadius: 10 },
  noRightText: { fontSize: width * 0.03, fontFamily: "Montserrat-Medium", marginLeft: "5%" },
  noRightButtons: { flex: 1, flexDirection: "column", justifyContent: "space-evenly", alignItems: "flex-end", marginRight: "2%" },
  noRightButton: { height: "40%", aspectRatio: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', },
  noRightButtonImg: { height: "50%", aspectRatio: 1 },
});

