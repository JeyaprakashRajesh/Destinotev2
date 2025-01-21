
import { Marker } from "react-native-maps";
const renderBusMarkers = ({bus}) => {
    const calculateBearing = (prev, current) => {
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
              ? require("../../../../assets/pictures/bus-blue.png")
              : require("../../../../assets/pictures/bus-red.png")
          }
          rotation={rotation}
          anchor={{ x: 0.5, y: 0.5 }}
        />
      );
    });
  };


  export default renderBusMarkers