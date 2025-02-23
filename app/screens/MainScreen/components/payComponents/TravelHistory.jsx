import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, FlatList } from "react-native";
import { useEffect, useState } from "react";
const { height, width } = Dimensions.get("screen");
import { secondaryAcent, primary, secondary, thirtiary } from "../../../../utilities/color";

export default function TravelHistory({ navigation, data, setData }) {

    const travelHistory = (item , index)=>{
        return (
            <View  style={styles.historyItem} key={index}>
                <View style={styles.historyDetails}>
                    <Text style={styles.historyDetailsText}>
                        {item.item.fromName}
                    </Text>
                    <Text style={[styles.historyDetailsText , {color : primary}]}>
                        {item.item.vehicle}
                    </Text>
                    <Text style={styles.historyDetailsText}>
                        {item.item.toName}
                    </Text>
                    <View style={styles.lineContainer}>

                    </View>
                </View>
                <View style={styles.historyAmount}>
                    <Text style={styles.amountText}>
                        ₹ {item.item.amount}
                    </Text>
                </View>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <Image
                        source={require("../../../../assets/pictures/back.png")}
                        style={styles.backImg}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.topText}>Travel History</Text>
            </View>
            <View style={styles.historyContainer}>
                {data && <FlatList
                    data={data.travelHistory}
                    keyExtractor={(item , index) => index}
                    renderItem={travelHistory}
                    showsVerticalScrollIndicator={false}
                />}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: secondary,
        paddingHorizontal: "5%",
        paddingVertical: "7%",
    },
    topContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    back: {
        height: height * 0.045,
        aspectRatio: 1,
    },
    backImg: {
        height: "100%",
        tintColor: primary,
    },
    topText: {
        fontSize: width * 0.085,
        color: thirtiary,
        marginLeft: width * 0.03,
        fontFamily: "JosefinSans-Medium",
        marginTop: width * 0.015,
    },
    historyContainer: {
        flex: 1,
        marginTop: "5%",
        flexDirection: "column"
    },
    historyItem: {
        backgroundColor : secondaryAcent,
        width : "100%",
        paddingHorizontal : "5%",
        paddingVertical : "5%",
        borderRadius : 10,
        marginVertical : "2%",
        flexDirection : "row",
        justifyContent : "space-between",
        height : 200
    },
    historyDetails : {
        flex : 1,
        flexDirection : "column",
        justifyContent : "space-between",
        position : "relative"
    },
    historyAmount : {
        height : "100%",
        width : "30%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    amountText : {
        fontSize : width * 0.08,
        color : thirtiary,
        fontFamily : "Montserrat-SemiBold"
    },
    historyDetailsText : {
        color : thirtiary,
        fontSize : width * 0.04,
        fontFamily : "Montserrat-SemiBold",
        marginLeft : 10
    },
    lineContainer : {
        position : "absolute",
        width : 5,
        height : "100%",
        backgroundColor : primary,
        left : 0,
        top : 0,
        borderRadius : 2000

    }
})