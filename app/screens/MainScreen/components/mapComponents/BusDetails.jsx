import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity , Dimensions , Image, Platform } from "react-native";
import { primary, secondary, thirtiary } from "../../../../utilities/color.js";
const { height, width } = Dimensions.get("screen");
const blue = "#034694";
const red = "#B22222";
const BusDetails = ({ selectedBusMarker }) => {
  if (!selectedBusMarker) return null;

  return (
    <View style={[styles.container , {backgroundColor : selectedBusMarker.busType === "Town Bus" ? red : blue}]}>
      <View style={styles.detailsContainer}>
        <Text style={styles.busType}>{selectedBusMarker.busType}</Text>
        <View style={styles.detailsHeading}>
            <Text style={styles.detailsHeadingText}>{selectedBusMarker.busType === "Town Bus" ? `Bus No : ${selectedBusMarker.BusNo}` : ``}</Text>
        </View>
        <Text style={styles.busDistrict}>{selectedBusMarker.busDistrict} , TamilNadu</Text>
        <TouchableOpacity style={styles.reportContainer}>
          <Image
            source={require("../../../../assets/pictures/report.png")}
            style={[
              styles.reportImage,
              {
                tintColor: selectedBusMarker.busType === "Town Bus"  ?red  : blue,
              },
            ]}
        />  
        <Text style={[styles.reportText ,{color : selectedBusMarker.busType === "Town Bus"  ?red  : blue }]}>Report</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.busNumberPlateContainer}>
        <Text  style={[styles.NumberPlateHeading,{color : selectedBusMarker.busType === "Town Bus"  ?red  : blue }]}>Vehicle No</Text>
        <View style={styles.NumberPlateContent}>
            <Text style={[styles.First6,{color : selectedBusMarker.busType === "Town Bus"  ?red  : blue }]}>
                {selectedBusMarker.VehicleNo.substring(0, 6)}
            </Text>
            <Text style={[styles.Remaining4,{color : selectedBusMarker.busType === "Town Bus"  ?red  : blue }]}>
            {selectedBusMarker.VehicleNo.substring(6)}
            </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 170,
    position: "absolute",
    width: width * 0.95,
    bottom: 10,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row"
  },
  busType : {
    fontSize: width * 0.055,
    color : thirtiary,
    fontFamily : "Montserrat-SemiBold"
  },
  detailsContainer :  {
    height : "100%",
    flex : 1,
    position : "relative"
  },
  detailsHeading : {

  },
  detailsHeadingText : {
    color : thirtiary,
    fontSize : width * 0.045,
    fontFamily : "Montserrat-Medium"
  },
  busDistrict : {
    fontSize : width * 0.03,
    fontFamily : "Montserrat-Medium",
    color : thirtiary
  },
  reportContainer : {
    position : "absolute",
    left : 0,
    bottom : 0,
    display : "flex",
    flexDirection : "row",
    padding : 5,
    backgroundColor : thirtiary,
    borderRadius : 10000,
    alignItems : "center"
  },
  reportImage : {
    width : 25,
    height : 25
  },
  reportText : {
    fontFamily : "Montserrat-SemiBold",
    fontSize : width * 0.035,
    marginLeft : 5,
    marginRight : 5,
    marginTop : width * 0.004,
    padding : 5
  },
  busNumberPlateContainer : {
    height : "100%",
    aspectRatio : 1,
    flexDirection : "column",
    alignItems : "center",
    justifyContent : "space-evenly",
    position : "relative",
    backgroundColor : thirtiary,
    borderRadius : 10
},
NumberPlateHeading : {
    fontFamily : "Montserrat-SemiBold",
    fontSize : width * 0.03,
},
NumberPlateContent : {
    alignItems : "center",
},
First6 : {
    fontSize : width * 0.04,
    fontFamily : "Montserrat-SemiBold",
},
Remaining4 : {
    fontSize : width * 0.06,
    fontFamily : "Montserrat-SemiBold",
}
});

export default BusDetails;
