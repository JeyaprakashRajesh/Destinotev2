import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Dimensions, Image, Keyboard } from "react-native";
import { primary, secondary, thirtiary } from "../../../../utilities/color.js";

const { height, width } = Dimensions.get("screen");
import { BACKEND_URL } from "../../../../utilities/routes.js";

export default function SearchScreen({ navigation , setDirection}) {
  const [stops, setStops] = useState([]);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/busstops/`)
      .then(res => setStops(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);

    return () => clearTimeout(focusTimeout);
  }, []);

  const filteredStops = stops.filter(stop => {
    const stopName = stop.name.toLowerCase();
    const queryChars = query.toLowerCase().split("");

    return queryChars.every(char => stopName.includes(char));
  });

  const highlightMatch = (text, query) => {
    if (!query) return <Text style={styles.resultText}>{text}</Text>;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <Text style={styles.resultText}>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <Text key={index} style={styles.highlight}>{part}</Text>
          ) : (
            <Text key={index} style={styles.resultText}>{part}</Text>
          )
        )}
      </Text>
    );
  };
  const handleClick = (item) => {
    setDirection(item)
    navigation.navigate("directions")
  }


  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Image
              source={require("../../../../assets/pictures/back.png")}
              style={styles.backImg}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Search..."
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              inputRef.current?.blur();
            }}
          >
            <Image
              source={require("../../../../assets/pictures/search.png")}
              style={styles.searchImg}
              resizeMode="contain"
            />
          </TouchableOpacity>

        </View>
      </View>

      {query.trim() === "" ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../../../assets/pictures/search.png")}
            style={styles.emptySearchLogo}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>
            Search for a Bus Stop
          </Text>
        </View>
      ) : (
        filteredStops.length === 0 ?
          <View style={styles.noResultContainer}>
            <Image
              source={require("../../../../assets/pictures/no-location.png")}
              style={styles.emptySearchLogo}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>
              No Results Found
            </Text>
          </View>
          :
          <FlatList
            data={filteredStops}
            style={{ marginTop: 30 }}
            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
            renderItem={({ item }) => (
              <View style={styles.elementContainer}>
                <Image
                  source={item.type === "terminal" ? require("../../../../assets/pictures/searchMarkerBlue.png") : require("../../../../assets/pictures/searchMarkerRed.png")}
                  style={styles.markerImg}
                  resizeMode="contain"
                />
                <TouchableOpacity style={styles.resultItem} onPress={() => handleClick(item)}>
                  {highlightMatch(item.name, query)}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.copyContainer}
                  onPress={() => setQuery(item.name)}
                >
                  <Image
                    source={require("../../../../assets/pictures/arrow-up.png")}
                    style={styles.copyImg}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            )}
            showsVerticalScrollIndicator={false} 
            bounces={false} 
            overScrollMode="never"
          />

      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  searchContainer: { paddingLeft: 5, paddingRight: 5, width: "100%" },
  searchBar: {
    height: 50,
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 5,
    backgroundColor: "#ebebeb",
    borderRadius: 10000,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  back: { height: "100%", aspectRatio: 1, alignItems: "center", justifyContent: "center", marginRight: 10 },
  input: { fontFamily: "Montserrat-SemiBold", fontSize: 15, flex: 1 },
  backImg: { height: "70%", aspectRatio: 1, tintColor: secondary },
  searchButton: { height: "90%", aspectRatio: 1, borderRadius: 100000, backgroundColor: secondary, alignItems: "center", justifyContent: "center" },
  searchImg: { height: "60%", aspectRatio: 1, tintColor: thirtiary },
  resultText: { fontSize: 16, color: "#333" },
  highlight: { backgroundColor: primary, color: "white", fontWeight: "bold" },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptySearchLogo: { tintColor: "gray", width: width * 0.4, height: width * 0.4, opacity: 0.2 },
  emptyText: { fontFamily: "Montserrat-SemiBold", fontSize: width * 0.05, color: "gray", opacity: 0.2, marginTop: height * 0.03 },
  noResultContainer: { flex: 1, alignItems: "center", justifyContent: "center" },

  elementContainer: { width: "100%", height: 70, flexDirection: "row", alignItems: 'center', },
  markerImg: { width: "6%", aspectRatio: 1 },
  resultItem: { flex: 1, marginLeft: "5%" , borderBottomColor : "gray" , borderBottomWidth : 2 , height : "100%" , alignItems: 'center', flexDirection : "row" },
  resultText: { fontFamily: "Montserrat-Medium", fontSize: width * 0.035, color: "gray" , marginTop : 2 },
  copyContainer: { height: "100%", paddingLeft: "2%", paddingRight: "2%", alignItems: "center", justifyContent: "center" , borderBottomColor : "gray" , borderBottomWidth : 2 },
  copyImg: { height: "30%", aspectRatio: 1, tintColor: "gray" }
});
