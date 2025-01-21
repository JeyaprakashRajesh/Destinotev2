import React from "react";
import { useState, useEffect } from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
const { height, width } = Dimensions.get("screen");
import { primary, secondary, thirtiary } from "../../../../utilities/color.js";
import axios from "axios";
const blue = "#034694";
const red = "#B22222";



const StopDetails = React.memo(
  ({
    selectedStop,
    backendURL,
    setArrivalStatus,
    arrivalStatus,
    setStopCoordinates,
    setSelectedBus,
  }) => {
    const [loadingBusData, setLoadingBusData] = useState(false);
    const [arrivalTimeInMinutes, setArrivalTimeInMinutes] = useState(null);
      
    useEffect(() => {
        console.log("useEffect StopDetails")
      setStopCoordinates(selectedStop.coordinates); 
      if (selectedStop) {
        if (arrivalTimeInMinutes === null) {
          setLoadingBusData(true);
        }
        axios
          .post(`${backendURL}/api/buses/getMarkerBus`, { selectedStop })
          .then((response) => {
            const { expectedArrivalTime } = response.data.closestBus || {};
            const status = response.data.arrivalStatus;
            setArrivalStatus(status);
            setSelectedBus(response.data.closestBus.currentCoordinates)

            if (expectedArrivalTime) {
              const currentTime = new Date();
              const arrivalTime = new Date(expectedArrivalTime);

              const differenceInMinutes = Math.ceil(
                (arrivalTime - currentTime) / (1000 * 60)
              );
              setArrivalTimeInMinutes(
                differenceInMinutes > 0 ? differenceInMinutes : 0
              );
            } else {
              setArrivalTimeInMinutes(null);
            }
          })
          .catch(() => {
            setArrivalTimeInMinutes(null);
            setArrivalStatus(null);
          })
          .finally(() => {
            setLoadingBusData(false);
          });
      }
    }, [selectedStop]);

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
        <View style={styles.stopDetailsLeftContainer}>
          <View style={styles.stopDetailsLeftDetailsContainer}>
            <Text style={styles.stopDetailsLeftDetailsName}>
              {selectedStop.name}
            </Text>
            <Text style={styles.stopDetailsLeftDetailsDescription}>
              {selectedStop.district}, {selectedStop.state}
            </Text>
          </View>
          <View style={styles.stopDetailsLeftButtonsContainer}>
            <TouchableOpacity style={styles.stopDetailsLeftButton}>
              <Image
                source={require("../../../../assets/pictures/report.png")}
                style={[
                  styles.stopDetailsLeftButtonImage,
                  {
                    tintColor: selectedStop.type === "terminal" ? blue : red,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.stopDetailsLeftButton}>
              <Image
                source={require("../../../../assets/pictures/share.png")}
                style={[
                  styles.stopDetailsLeftButtonImage,
                  {
                    tintColor: selectedStop.type === "terminal" ? blue : red,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.stopDetailsLeftButton}>
              <Image
                source={require("../../../../assets/pictures/directions.png")}
                style={[
                  styles.stopDetailsLeftButtonImage,
                  {
                    tintColor: selectedStop.type === "terminal" ? blue : red,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.stopDetailsRightContainer}>
          <View style={styles.stopDetailsRightText}>
            <Text style={styles.stopDetailsRightTextDetails}>Next Bus</Text>
            <Text style={styles.stopDetailsRightTextDetails}>
              {" "}
              available in
            </Text>
          </View>
          <View style={styles.stopDetailsRightDetails}>
            {loadingBusData ? (
              <ActivityIndicator size="small" color="white" />
            ) : arrivalTimeInMinutes !== null ? (
              <>
                <Text style={styles.stopDetailsRightETAText}>
                  {arrivalTimeInMinutes === 0 ? "<1" : arrivalTimeInMinutes}
                  <Text style={{ fontSize: width * 0.04 }}> min</Text>
                </Text>
                {arrivalStatus && (
                  <Text style={styles.stopDetailsRightStatusText}>
                    {arrivalStatus}
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.stopDetailsRightTextDetails}>Nil</Text>
            )}
          </View>
          <View style={styles.stopDetailsRightStatus}></View>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.selectedStop === nextProps.selectedStop;
  }
);

const styles = StyleSheet.create({
  stopDetailsContainer: {
    height: 170,
    position: "absolute",
    width: width * 0.95,
    bottom: 10,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
  },
  stopDetailsLeftContainer: {
    height: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  stopDetailsRightContainer: {
    height: "100%",
    aspectRatio: 1,
    flexDirection: "column",
  },
  stopDetailsLeftDetailsContainer: {
    flexDirection: "column",
  },
  stopDetailsLeftButtonsContainer: {
    flexDirection: "row",
    height: "30%",
    gap: 10,
  },
  stopDetailsLeftDetailsName: {
    fontSize: width * 0.055,
    color: thirtiary,
    fontFamily: "Montserrat-SemiBold",
  },
  stopDetailsLeftDetailsDescription: {
    fontSize: width * 0.03,
    color: thirtiary,
    fontFamily: "Montserrat-Regular",
  },
  stopDetailsLeftButton: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 1000,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  stopDetailsLeftButtonImage: {
    height: "55%",
    width: "55%",
    resizeMode: "contain",
  },
  stopDetailsRightText: {
    flexDirection: "column",
    alignItems: "center",
  },
  stopDetailsRightTextDetails: {
    color: thirtiary,
    fontFamily: "Montserrat-SemiBold",
    fontSize: width * 0.03,
  },
  stopDetailsRightDetails: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stopDetailsRightETAText: {
    color: thirtiary,
    fontFamily: "Montserrat-SemiBold",
    fontSize: width * 0.06,
    position: "absolute",
    bottom: "40%",
  },
  stopDetailsRightStatusText: {
    color: thirtiary,
    fontFamily: "Montserrat-SemiBold",
    position: "absolute",
    bottom: "5%",
  },
});
export default StopDetails;
