import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../../../utilities/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { height, width } = Dimensions.get("screen");
import { secondaryAcent, primary, secondary, thirtiary } from "../../../../utilities/color";
import LottieView from "lottie-react-native";



export default function QR({ navigation, data, setData }) {
    const [isScanning, setScanning] = useState(true);
    const [permission, requestPermission] = useCameraPermissions();
    const [parsedData, setParsedData] = useState(null);
    const [to, setTo] = useState(null);
    const [from, setFrom] = useState(null);
    const [bus, setBus] = useState(null);
    const [confirm, setConfirm] = useState(false)

    useEffect(() => {
        if (permission?.status !== "granted") {
            requestPermission();
        }
    }, [permission]);

    const handleBarcodeScanned = async ({ data }) => {
        try {
            const scannedData = JSON.parse(data);
            if (scannedData.name === "Destinote") {
                setScanning(false);
                setParsedData(scannedData);
            }
        } catch (error) {
            console.error("Error parsing QR code:", error);
        }
    };

    const handleConfirm = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.post(
                `${BACKEND_URL}/api/user/qr`,
                { data: parsedData },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data) {
                setData(response.data.data);
                setTo(response.data.toStop);
                setFrom(response.data.fromStop);
                setBus(response.data.bus);
                setConfirm(true);
            }
        } catch (error) {
            console.error("Payment confirmation failed:", error);
            alert("Payment failed. Please try again.");
        }
    };



    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text>Requesting camera permission...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isScanning ? (
                <CameraView
                    style={styles.camera}
                    facing="back"
                    barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                    onBarcodeScanned={handleBarcodeScanned}
                />
            ) : (
                (!confirm) ?
                    <View style={styles.container}>
                        <View style={styles.illustrationContainer}>
                            <Image
                                source={require("../../../../assets/pictures/recharge-icon.png")}
                                style={styles.illustrationBackground}
                                resizeMode="contain"
                                tintColor={secondaryAcent}
                            />
                            <Image
                                source={require("../../../../assets/pictures/rupee-ticket.png")}
                                style={styles.illustrationWallet}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.heading}>
                                Confirm Payment
                            </Text>
                            <View style={styles.balance}>
                                <Text style={styles.balanceText}>₹ {parsedData.payload.amount}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    handleConfirm()
                                }}
                            >
                                <Text style={styles.buttonText}>
                                    Make Payment
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    :
                    <View style={[styles.container, { justifyContent: "flex-start" }]}>
                        <View style={styles.headingContainer}>
                            <LottieView
                                source={require("../../../../assets/pictures/sucess.json")}
                                autoPlay
                                loop={false}
                                style={{ width : width * 0.2 , height : width * 0.2 }}
                            />
                            <Text style={styles.headingText}>
                                Payment Sucessful
                            </Text>
                        </View>

                        <View style={styles.detailsContainer}>

                            <View style={styles.stopContainer}>
                                <View style={styles.stopImgContainer}>
                                    <Image
                                        source={from.type === "stop" ?  require("../../../../assets/pictures/farMarkerRed.png") : require("../../../../assets/pictures/farMarkerBlue.png")}
                                        style={styles.stopImg}
                                        resizeMode="contain"
                                    />
                                    <View style={styles.stopLine}></View>
                                </View>
                                <View style={styles.stopDetailsContainer}>
                                    <Text style={styles.stopName}>
                                        {from.name}
                                    </Text>
                                    <Text style={styles.stopType}>
                                        Type : {from.type}
                                    </Text>
                                    <Text style={styles.stopDistrict}>
                                        {from.district} , {from.state}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.stopContainer}>
                                <View style={styles.stopImgContainer}>
                                    <Image
                                        source={to.type === "stop" ?  require("../../../../assets/pictures/farMarkerRed.png") : require("../../../../assets/pictures/farMarkerBlue.png")}
                                        style={styles.stopImg}
                                        resizeMode="contain"
                                    />
                                </View>
                                <View style={styles.stopDetailsContainer}>
                                    <Text style={styles.stopName}>
                                        {to.name}
                                    </Text>
                                    <Text style={styles.stopType}>
                                        Type : {to.type}
                                    </Text>
                                    <Text style={styles.stopDistrict}>
                                        {to.district} , {to.state}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.bottomContainer}>
                            <View style={styles.busContainer}>

                            </View>
                        </View>
                    </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: secondary,
        justifyContent: "center",
        alignItems: "center",
    },
    camera: {
        flex: 1,
        width: "100%",
    },
    illustrationContainer: {
        height: width * 0.6,
        aspectRatio: 1,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    illustrationBackground: {
        height: "100%",
        width: "100%",
    },
    illustrationWallet: {
        position: "absolute",
        height: "41%",
        width: "41%",
    },
    heading: {
        fontSize: width * 0.07,
        color: thirtiary,
        fontFamily: "Montserrat-SemiBold"
    },
    textContainer: {
        alignItems: 'center',
        gap: 20
    },
    balanceText: {
        color: thirtiary,
        fontSize: width * 0.1, 
        fontFamily: "Montserrat-SemiBold",
    },
    balance: {
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.06,
        borderRadius: 10,
        borderColor: primary,
        borderWidth: 3
    },
    button: {
        backgroundColor: primary,
        paddingHorizontal: width * 0.08,
        paddingVertical: height * 0.015,
        borderRadius: 10,
        marginTop: height * 0.015
    },
    buttonText: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: width * 0.05,
        color: thirtiary
    },
    detailsContainer: {
        backgroundColor: secondaryAcent,
        width: width * 0.85,
        padding: width * 0.05,
        borderRadius: 10,
        marginTop: width * 0.07,
        height : height * 0.4,
        flexDirection : "column",
        jusrifyContent : "space-between",
        position : "relative"
    },
    headingContainer : {
        flexDirection : "row",
        alignItems : "center",
        gap : 10,
        width : width * 0.9,
        marginTop : height * 0.03
    },
    headingText : {
        fontSize : width * 0.05,
        color : thirtiary,
        fontFamily : "Montserrat-SemiBold"
    },
    stopContainer : {
        flexDirection : "row",
        justifyContent : "space-between",
        height : "50%",
        width : "100%",
    },
    stopImgContainer : {
        width : "20%",
        height : "100%",
        justifyContent : "center",
        alignItems : "center",
        position : "relative"
    },
    stopImg : {
        height : "100%",
        width : "40%",
        zIndex : 2
    },
    stopDetailsContainer : {
        flex : 1,
        marginLeft : "5%",
        justifyContent : "center",
        gap : "5%"
    },
    stopName : {
        fontSize : width * 0.06,
        color : thirtiary,
        fontFamily : "Montserrat-SemiBold"
    },
    stopType : {
        fontSize : width * 0.035,
        color : primary,
        fontFamily : "Montserrat-SemiBold"
    },
    stopDistrict : {
        fontSize : width * 0.035,
        color : primary,
        fontFamily : "Montserrat-SemiBold"
    },
    stopLine : {
        position : "absolute",
        height : "50%",
        width : 5,
        backgroundColor : primary,
        left : "50%" - 1,
        top : "75%",
        zIndex : 1,
        borderRadius : 100
    },
    bottomContainer : {
        width: width * 0.85,
        flex : 1,
        marginVertical: height * 0.02,
        flexDirection : "row",
        justifyContent : "space-between",
    }
});
