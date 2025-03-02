import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

export default function Search({
  nearbyStops,
  setSearchSelected,
  setSelectedMarker,
  isSearching,
  setIsSearching,
}) {
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (search.length > 0) {
      setIsSearching(true);
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
      {
        isSearching ? 
        <div>
            adaw
        </div>
        :
        null
      }
    </div>
  );
}
