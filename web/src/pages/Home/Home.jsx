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
import RenderDetails from "./mapComponents/renderDetails";
import { BACKEND_URL } from "../../utils/routes";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PayWallet from "../../assets/pay_wallet.png";

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
  const [markerSelected, setMarkerSelected] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [fetched, setFetched] = useState(false);
  const [markerBusSelectedCoordinates, setMarkerBusSelectedCoordinates] =
    useState([]);
  const [MarkerBusDetails, setMarkerBusDetails] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [monthlyOutflow, setMonthlyOutflow] = useState(0);

  const navigation = useNavigate();

  const mapRef = useRef(null);
  const socket = useRef(null);
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/api/user/get-details`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("API Response:", response.data);

          if (response.data && response.data.data) {
            setData(response.data.data);
            setLoading(false);
            calculateMonthlyOutflow()
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          localStorage.removeItem("token");
          setLoading(false);
          navigation("/auth");
        }
      } else {
        console.log("Token not found");
        localStorage.removeItem("token");
        navigation("/auth");
        setLoading(false);
      }
    })();
  }, []);
  const calculateMonthlyOutflow = (transactions) => {
    if (!transactions || transactions.length === 0) {
      setMonthlyOutflow(0);
      return;
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let debitTotal = 0;
    let creditTotal = 0;
    
    data.transactionHistory.forEach((transaction) => {
      if (!transaction || !transaction.date) return;

      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth();
      const transactionYear = transactionDate.getFullYear();

      if (transactionMonth === currentMonth && transactionYear === currentYear) {
        if (transaction.operation === "debit") {
          debitTotal += transaction.transactionAmount || 0;
        } else if (transaction.operation === "credit") {
          creditTotal += transaction.transactionAmount || 0;
        }
      }
    });

    setMonthlyOutflow(creditTotal - debitTotal );
  };


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
        setNearbyStops(stops);
      });

      socket.current.on("busLocations", (busLocations) => {
        setBus(busLocations);
      });
      return () => {
        socket.current.disconnect();
      };
    }
  }, [location]);
  useEffect(() => {
    console.log(selectedMarker);
  }, [selectedMarker]);

  useEffect(() => {
    console.log(selectedBus);
  }, [selectedBus]);

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
      <div className="flex-1 bg-secondary overflow-hidden relative pl-4 pt-4 pb-4 flex justify-center  ">
        <LoadScript
          googleMapsApiKey={GOOGLE_API}
          className="rounded-lg relative"
        >
          {searchSelected || selectedBus || markerSelected ? (
            <RenderDetails
              selectedMarker={selectedMarker}
              selectedBus={selectedBus}
              setSelectedBus={setSelectedBus}
              setSelectedMarker={setSelectedMarker}
              setMarkerBusSelectedCoordinates={setMarkerBusSelectedCoordinates}
              setMarkerBusDetails={setMarkerBusDetails}
              MarkerBusDetails={MarkerBusDetails}
            />
          ) : null}
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
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [
                      {
                        visibility: "off",
                      },
                    ],
                  },
                  {
                    featureType: "poi.business",
                    stylers: [
                      {
                        visibility: "off",
                      },
                    ],
                  },
                  {
                    featureType: "poi.park",
                    elementType: "labels.text",
                    stylers: [
                      {
                        visibility: "off",
                      },
                    ],
                  },
                  {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [
                      {
                        color: "#bdbdbd",
                      },
                    ],
                  },
                  {
                    featureType: "road",
                    elementType: "labels.icon",
                    stylers: [
                      {
                        visibility: "off",
                      },
                    ],
                  },
                  {
                    featureType: "road.local",
                    elementType: "labels.icon",
                    stylers: [
                      {
                        visibility: "off",
                      },
                    ],
                  },
                ],
              }}
              onClick={() => {
                setSearchSelected(false);
                setSelectedMarker(null);
                setMarkerSelected(false);
                setSelectedBus(null);
                setMarkerBusSelectedCoordinates([]);
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
          setSelectedBus={setSelectedBus}
        />
        {!isLoading ? (
          !isSearching &&
          data && (
            <div className="w-full">
              <div className="mt-4 w-full bg-secondaryAcent h-40 rounded-xl flex flex-row p-4">
                <div className="w-4/10 h-full">
                  <img
                    src={PayWallet}
                    alt="wallet.png"
                    className="h-full contain-content"
                  />
                </div>
                <div className="flex-1 flex flex-col items-center justify-evenly">
                  <div className="font-semibold text-2xl text-white">
                    BALANCE
                  </div>
                  <div className="h-15 flex items-center text-3xl font-semibold text-[#c1a538]">
                    Rs.{data.balance}
                  </div>
                </div>
              </div>
              <div className="w-full mt-4 h-130  bg-secondaryAcent rounded-xl p-4">
                <div className="w-full font-medium text-xl text-white">
                  Transaction History
                </div>
                <div className="w-full h-110 mt-4 overflow-y-auto">
                  {data.transactionHistory
  .slice() // creates a shallow copy
  .reverse() // reverses the copy
  .map((item, index) => {
    const transactionDate = new Date(item.date);
    const formattedTime = transactionDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const formattedDate = transactionDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return (
      <div
        className={`${
          item.operation === "credit" ? "bg-[#4c8555]" : "bg-[#854848]"
        } h-30 w-full mt-4 rounded-xl p-4 flex flex-row `}
        key={index}
      >
        <div className="w-1/2 flex flex-col">
          <div className="font-semibold text-2xl text-white">
            {item.operation}
          </div>
          <div className="text-white font-medium text-sm mt-2">
            {formattedTime} {formattedDate}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-2xl font-medium text-white">
          Rs.{item.transactionAmount}
        </div>
      </div>
    );
  })}

                </div>
              </div>
              <div className="h-20 w-full bg-secondaryAcent text-lg px-8 rounded-xl mt-4 p-4 flex flex-row items-center justify-between text-white font-medium">
                <div>Monthly Outflow : </div>
                <div className="text-[#c1a538]">Rs.{monthlyOutflow}</div>
              </div>
              <div>

              </div>
            </div>
          )
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
