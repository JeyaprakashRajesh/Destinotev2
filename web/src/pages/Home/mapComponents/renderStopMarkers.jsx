import React from "react";
import { Marker } from "@react-google-maps/api";
import MarkerRed from "../../../assets/farMarkerRed.png";
import MarkerBlue from "../../../assets/farMarkerBlue.png";

const RenderStopMarkers = ({ nearbyStops, setSelectedStop, setMarkerSelected, setSearchSelected }) => {
  return nearbyStops.map((stop, index) => {
    if (stop.type !== "bus") {
      return (
        <Marker
          key={index}
          position={{
            lat: stop.coordinates[1], // Ensure this order is correct for your data
            lng: stop.coordinates[0],
          }}
          onClick={() => {
            setSearchSelected(false);
            setSelectedStop(stop);
            setMarkerSelected(true);
          }}
          icon={{
            url: stop.type === "terminal" ? MarkerBlue : MarkerRed,
            scaledSize: new window.google.maps.Size(20, 31), // Optional: Resize marker
          }}
        />
      );
    }
    return null;
  });
};

export default RenderStopMarkers;
