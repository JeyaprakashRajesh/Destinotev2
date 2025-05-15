import { Marker } from "@react-google-maps/api";
import BusRed from "../../../assets/bus-red.png";
import BusBlue from "../../../assets/bus-blue.png";

const RenderBusMarkers = ({ bus, setSelectedStop, setMarkerSelected, setSearchSelected, setSelectedBus }) => {
  const calculateBearing = (prev, current) => {
    if (!prev || !current) return 0;

    const toRadians = (degree) => (degree * Math.PI) / 180;
    const toDegrees = (radian) => (radian * 180) / Math.PI;

    const lat1 = toRadians(prev[1]); // latitude
    const lon1 = toRadians(prev[0]); // longitude
    const lat2 = toRadians(current[1]); // latitude
    const lon2 = toRadians(current[0]); // longitude

    const dLon = lon2 - lon1;

    const x = Math.sin(dLon) * Math.cos(lat2);
    const y =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let bearing = toDegrees(Math.atan2(x, y));
    return (bearing + 360) % 360;
  };

  return bus.map((busItem) => {
    const currentCoordinates = {
      lat: busItem.busCoordinates[1], 
      lng: busItem.busCoordinates[0],
    };

    const rotation = calculateBearing(busItem.previousCoordinates, busItem.busCoordinates);

    const icon = {
      url: busItem.busType === "State Bus" ? BusBlue : BusRed,
      scaledSize: new window.google.maps.Size(15, 40), 
    };

    return (
      <Marker
        key={busItem.VehicleNo}
        position={currentCoordinates}  
        onClick={() => {
          if (busItem && busItem.busCoordinates && busItem.busCoordinates.length >= 2) {
            setSelectedBus(busItem);
            setSelectedStop(null);
            setMarkerSelected(true);
            setSearchSelected(false);
          }
        }}
        icon={icon}
        rotation={rotation}
        anchor={{ x: 0.5, y: 0.5 }}
      />
    );
  });
};

export default RenderBusMarkers;
