import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
} from "react-native";
import {
    secondary,
    thirtiary,
    secondaryAcent,
    primary,
} from "../../../../utilities/color";
const { height, width } = Dimensions.get("screen");
import LottieView from "lottie-react-native";
import { CommonActions } from "@react-navigation/native";

export default function paymentMessage({ navigation, data, paymentResponse }) {
    return (
        <View style={styles.container}>
            <LottieView
                source={paymentResponse ? require("../../../../assets/pictures/sucess.json") : require("../../../../assets/pictures/failure.json")}
                autoPlay
                loop={false}
                style={{ width: width * 0.45, height: width * 0.45 }}
            />
            <View style={styles.textContainer}>
                <Text style={styles.heading}>
                    {paymentResponse ? "Payment Successful" : "Payment Failure"}
                </Text>
                <Text style={styles.balance}>
                    Balance :<Text style={styles.balanceText}> ₹ {data.balance}</Text>
                </Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "pay" }],
                    })
                )}>
                    <Text style={styles.buttonText}>
                        continue
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: secondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        alignItems: 'center',
        gap: 20
    },
    heading: {
        fontSize: width * 0.06,
        color: thirtiary,
        fontFamily: "Montserrat-SemiBold"
    },
    balance: {
        fontSize: width * 0.06,
        color: thirtiary,
        fontFamily: "Montserrat-SemiBold"
    },
    balanceText: {
        color: primary,
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
    }
})