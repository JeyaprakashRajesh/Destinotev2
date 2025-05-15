import React, { useEffect, useState } from "react";
import blueMarker from "../../../assets/searchMarkerBlue.png";
import redMarker from "../../../assets/searchMarkerRed.png";
import { CiSearch } from "react-icons/ci";

export default function Search({
  nearbyStops,
  setSearchSelected,
  setSelectedMarker,
  selectedMarker,
  isSearching,
  setIsSearching,
  setMarkerSelected,
  setSelectedBus
}) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    if (search.length > 0) {
      setIsSearching(true);
      const filteredResults = nearbyStops.filter((stop) =>
        stop.name.toLowerCase().includes(search.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setIsSearching(false);
    }
  }, [search]);
  return (
    <div className={`w-full ${isSearching ? "h-full" : "h-16"} flex flex-col`}>
      <div
        className={`w-full h-16 bg-secondaryAcent rounded-2xl flex flex-row items-center pl-7 pr-7 gap-6`}
      >
        <CiSearch
          color="var(--color-thirtiary)"
          className="h-8 w-8 opacity-70"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="flex-1 outline-0 text-xl text-thirtiary"
        />
      </div>
      {isSearching ? (
        <div className="flex-1 overflow-y-scroll no-scrollbar text-thirtiary">
          {searchResults.length > 0 ? (
            searchResults.map((stop, index) => (
              <div
                key={index}
                className={`mt-5 mb-5 flex flex-row items-center gap-4 hover:bg-secondaryAcent cursor-pointer rounded-full transition-all ${selectedMarker ? (stop._id === selectedMarker._id ? "bg-secondaryAcent" : null) : null} `}
                onClick={() => {
                  setMarkerSelected(false)
                  setSearchSelected(true);
                  setSelectedMarker(stop);
                  setSelectedBus(null);
                  setSearch("");
                }}
              >
                <div className="h-14 w-14 rounded-full bg-secondaryAcent flex items-center justify-center">
                  <img
                    src={stop.type === "terminal" ? blueMarker : redMarker}
                    alt=""
                    className="h-1/2 w-1/2 object-cover"
                  />
                </div>
                <div>
                  <div className="text-xl font-semibold select-none">
                    {stop.name}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center">
              <CiSearch color="var(--color-thirtiary)" className=" w-40 h-40 opacity-50" />
              <div className="text-thirtiary text-xl font-semibold opacity-50 ml-7">
                No Matching stop Found
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
