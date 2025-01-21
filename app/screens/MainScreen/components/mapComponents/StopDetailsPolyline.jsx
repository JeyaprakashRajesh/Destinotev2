import React from "react";
import { Polyline } from "react-native-maps";

export default function StopDetailsPolyline({ selectedBus, stopCoordinates }) {
  if (!selectedBus || !stopCoordinates) {
    console.warn("Polyline not rendered: Missing coordinates");
    return null;
  }

  const formattedCoordinates = [
    { latitude: selectedBus[1], longitude: selectedBus[0] },
    { latitude: stopCoordinates[1], longitude: stopCoordinates[0] },
  ];

  console.log("Polyline Coordinates:", formattedCoordinates);

  return (
    <Polyline
      coordinates={formattedCoordinates}
    />
  );
}
