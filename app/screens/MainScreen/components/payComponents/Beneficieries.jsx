import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, FlatList } from "react-native";
import { useEffect, useState } from "react";
const { height, width } = Dimensions.get("screen");
import { secondaryAcent, primary, secondary, thirtiary } from "../../../../utilities/color";

export default function Beneficiaries({ navigation, data, setData }) {
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
                <Text style={styles.topText}>Beneficiaries</Text>
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
})