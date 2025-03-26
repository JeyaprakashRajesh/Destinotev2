import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Navigation } from "lucide-react";
import mapLocation from "../../assets/mapLocation.png";
import { GOOGLE_API, SOCKET_URL } from "../../utils/routes";
import { TbLocationFilled } from "react-icons/tb";
import { FaLayerGroup } from "react-icons/fa";
import io from "socket.io-client";
import Search from "./mapComponents/Search";
import RenderStopMarkers from "./mapComponents/renderStopMarkers";
import RenderBusMarkers from "./mapComponents/renderBusMarkers";

export default function Home() {
  const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "15px",
  };

  const [location, setLocation] = useState(null);
  const [pinLocation, setPinLocation] = useState(true);
  const [isSatellite, setIsSatellite] = useState(false);
  const [nearbyStops, setNearbyStops] = useState([]);
  const [bus, setBus] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [searchSelected, setSearchSelected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [markerSelected , setMarkerSelected] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null)
  const [fetched , setFetched] = useState(false)

  const mapRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(userLocation);

          if (pinLocation && mapRef.current) {
            mapRef.current.panTo(userLocation);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [pinLocation, location]);
  

  useEffect(() => {
    socket.current = io(SOCKET_URL);
    if (location) {
      const Location = { latitude: location.lat, longitude: location.lng };
      if (socket.current) {
        socket.current.emit("getNearbyStops", Location);
      }
      socket.current.on("nearbyStops", (stops) => {
        console.log(stops);
        setNearbyStops(stops);
      });

      socket.current.on("busLocations", (busLocations) => {
        console.log(busLocations);
        setBus(busLocations);
      });
      return () => {
        socket.current.disconnect();
      };
    }
  }, [location]);
  useEffect(() => {
    console.log(selectedMarker)
  },[selectedMarker])


  const handlePinClick = () => {
    setPinLocation((prev) => {
      const newPinLocation = !prev;

      if (newPinLocation && location && mapRef.current) {
        mapRef.current.panTo(location);
      }

      return newPinLocation;
    });
  };

  const handleDrag = () => {
    setPinLocation(false);
  };

  return (
    <div className="h-screen w-screen flex flex-row">
      <div className="flex-1 bg-secondary overflow-hidden relative pl-4 pt-4 pb-4  ">
        <LoadScript googleMapsApiKey={GOOGLE_API} className="rounded-lg">
          {location && (
            <GoogleMap
              className="z-1"
              mapContainerStyle={containerStyle}
              center={location}
              zoom={12}
              onLoad={(map) => (mapRef.current = map)}
              onDrag={handleDrag}
              options={{
                fullscreenControl: false,
                mapTypeId: isSatellite ? "satellite" : "roadmap",
              }}
              onClick={()=> {
                setSearchSelected(false);
                setSelectedMarker(null);
                setMarkerSelected(false);
              }}
            >
              <Marker position={location} icon={mapLocation} />
              <RenderStopMarkers 
                nearbyStops={nearbyStops}
                setSelectedStop={setSelectedMarker}
                setMarkerSelected={setMarkerSelected}
                setSearchSelected={setSearchSelected}
                setSelectedBus={setSelectedBus}
              />
              <RenderBusMarkers 
                setSelectedBus={setSelectedBus}
                bus={bus}
                setSelectedStop={setSelectedMarker}
                setMarkerSelected={setMarkerSelected}
                setSearchSelected={setSearchSelected}
              />
            </GoogleMap>
          )}
        </LoadScript>
        <div
          className="absolute h-10 aspect-square rounded-full bg-white z-5 bottom-15 left-[2vw] flex items-center justify-center cursor-pointer shadow-lg"
          onClick={handlePinClick}
        >
          <TbLocationFilled
            color={
              pinLocation ? "var(--color-primary)" : "var(--color-secondary)"
            }
            className="w-1/2 h-1/2"
          />
        </div>
        <div
          className="absolute h-10 aspect-square rounded-full bg-white z-5 bottom-30 left-[2vw] flex items-center justify-center cursor-pointer shadow-lg"
          onClick={() => setIsSatellite((prev) => !prev)}
        >
          <FaLayerGroup
            color={
              isSatellite ? "var(--color-primary)" : "var(--color-secondary)"
            }
            className="w-1/2 h-1/2"
          />
        </div>
      </div>
      <div className="w-[500px] bg-secondary justify-center p-4 overflow-y-scroll no-scrollbar">
        <Search
          nearbyStops={nearbyStops}
          setSearchSelected={setSearchSelected}
          setSelectedMarker={setSelectedMarker}
          selectedMarker={selectedMarker}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          setMarkerSelected={setMarkerSelected}
        />
      </div>
    </div>
  );
}
