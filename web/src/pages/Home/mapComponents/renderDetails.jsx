import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../utils/routes";
import axios from "axios";
import { MdReport } from "react-icons/md";
import { FaShareSquare } from "react-icons/fa";
import { FaDirections } from "react-icons/fa";

export default function renderDetails({
  selectedMarker,
  setSelectedMarker,
  selectedBus,
  setSelectedBus,
  setMarkerBusSelectedCoordinates,
  setMarkerBusDetails,
  MarkerBusDetails
}) {
  const [loadingBusData, setLoadingBusData] = useState(false);
  const [arrivalTimeInMinutes, setArrivalTimeInMinutes] = useState(null);
  const [arrivalStatus, setArrivalStatus] = useState(null);
  const [stopCoordinates, setStopCoordinates] = useState(null);

  useEffect(() => {
    console.log("selectedBus", selectedBus);
  }, [selectedBus]);

  useEffect(() => {
    if (selectedMarker) {
      setLoadingBusData(true);
      axios
        .post(`${BACKEND_URL}/api/buses/getMarkerBus`, { selectedStop: selectedMarker })
        .then((response) => {
          const { expectedArrivalTime } = response.data.closestBus || {};
          const status = response.data.arrivalStatus;
          setMarkerBusDetails(response.data.closestBus);
          setArrivalStatus(status);
          setMarkerBusSelectedCoordinates(response.data.closestBus?.currentCoordinates);

          if (expectedArrivalTime) {
            const currentTime = new Date();
            const arrivalTime = new Date(expectedArrivalTime);

            const differenceInMinutes = Math.ceil(
              (arrivalTime - currentTime) / (1000 * 60)
            );
            setArrivalTimeInMinutes(differenceInMinutes > 0 ? differenceInMinutes : 0);
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
  }, [selectedMarker]);
  
  if(loadingBusData) {
    return (
      <div className="absolute bottom-12 h-50 w-120 bg-white z-10 rounded-xl flex flex-row items-center justify-center">
        Loading...
      </div>
    )
  }
  return (
    <div className="absolute bottom-12 h-50 w-120 bg-white z-10 rounded-xl flex flex-row">
      
      {selectedMarker && <div className={`flex-1 p-4 ${selectedMarker.type === "stop" ? "bg-red" : "bg-blue"}  text-white rounded-xl flex flex-row`}>
        <div className="w-7/10 h-full flex flex-col justify-between ">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-medium">
              {selectedMarker.name}
            </div>
            <div className="text-sm">{selectedMarker.district} , {selectedMarker.state}</div>
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex items-center justify-center bg-white h-10 w-10 rounded-full">
              <MdReport className="h-6 w-6" color={`${selectedMarker.type === "stop" ? "var(--red)" : "var(--blue)"}`} />
            </div>
            <div className="flex items-center justify-center bg-white h-10 w-10 rounded-full">
              <FaShareSquare className="h-6 w-6" color={`${selectedMarker.type === "stop" ? "var(--red)" : "var(--blue)"}`} />
            </div>
            <div className="flex items-center justify-center bg-white h-10 w-10 rounded-full">
              <FaDirections className="h-6 w-6" color={`${selectedMarker.type === "stop" ? "var(--red)" : "var(--blue)"}`} />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between items-center">
          <div className="flex items-center align-center flex-col text-sm"> <div>Next Bus</div> <div>Available in </div></div>
          <div className="text-2xl font-semibold ">{arrivalTimeInMinutes ? arrivalTimeInMinutes + "Min" : "Nil"}</div>
          <div>{arrivalStatus}</div>
        </div>
      </div>}
      {selectedBus && (
        <div className={`flex-1 flex flex-row ${selectedBus.busType === "Town Bus" ? "bg-red" : "bg-blue"} rounded-xl text-white p-4`} >
          <div className="flex-1 h-full flex flex-col justify-between">
            <div className="flex flex-1 flex-col gap-2">
              <div className="text-2xl font-medium">
                {selectedBus.busType}
              </div>
              {selectedBus.BusNo && <div className="text-xl font-medium">
                Bus No : {selectedBus.BusNo}
              </div>}
              <div className="text-sm ">
                {selectedBus.busDistrict} , TamilNadu
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="flex items-center justify-center bg-white h-10 w-28 flex-row gap-2 rounded-full">
                <MdReport className="h-6 w-6" color={`${selectedBus.busType === "Town Bus" ? "var(--red)" : "var(--blue)"}`} />
                <div className={`text-sm ${selectedBus.busType === "Town Bus" ? "text-red" : "text-blue"}`}>Report</div>
              </div>
            </div>
          </div>
          <div className="w-40 flex flex-col justify-evenly items-center bg-white rounded-xl pt-4 pb-4">
            <div className={`text-sm ${selectedBus.busType === "Town Bus" ? "text-red" : "text-blue"} font-semibold`}>Vehicle No</div>
            <div className={` ${selectedBus.busType === "Town Bus" ? "text-red" : "text-blue"} font-semibold h-25 justify-center flex flex-col items-center`}>
              <div className="text-lg">{selectedBus.VehicleNo.substring(0, 6)}</div>
              <div className="text-2xl">{selectedBus.VehicleNo.substring(6)}</div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
