import React from "react";
import { Marker } from "react-native-maps";

const RenderMarkers = ({ nearbyStops, handleMarkerPress }) => {
    const getMarkerIcon = (stop) => {
        return stop.type === "stop"
          ? require("../../../../assets/pictures/farMarkerRed.png")
          : require("../../../../assets/pictures/farMarkerBlue.png");
      };
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

export default RenderMarkers;
