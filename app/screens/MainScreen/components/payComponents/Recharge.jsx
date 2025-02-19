import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import {
    primary,
    secondary,
    thirtiary,
    secondaryAcent,
} from "../../../../utilities/color";
import { useEffect, useState } from "react";
const { height, width } = Dimensions.get("screen");
import axios from "axios"
import { BACKEND_URL } from "../../../../utilities/routes";


export default function Recharge({ navigation, data , setData}) {
    const [amount, setAmount] = useState(0);

    const handleRecharge = async() => {
        try{
            axios.post()
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <View style={styles.illustrationContainer}>
                    <Image
                        source={require("../../../../assets/pictures/recharge-icon.png")}
                        style={styles.illustrationBackground}
                        resizeMode="contain"
                        tintColor={secondaryAcent}
                    />
                    <Image
                        source={require("../../../../assets/pictures/pay_wallet.png")}
                        style={styles.illustrationWallet}
                        resizeMode="contain"
                    />
                </View>
                <View>
                    <Text style={styles.rechargeText}>Wallet Recharge</Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.amountRupee}>₹</Text>
                    <TextInput
                        style={styles.amountField}
                        keyboardType="numeric"
                        value={amount}
                        placeholder="0"
                        onChangeText={(val) => setAmount(val)}
                        placeholderTextColor="grey"
                    />
                </View>
                <TouchableOpacity style={styles.buttonContainer} onPress={handleRecharge}>
                    <Text style={styles.button}>Recharge</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: secondary,
        alignItems: "center",
        justifyContent: "center",
    },
    innerContainer: {
        alignItems: "center",
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
        height: "75%",
        width: "75%",
    },
    rechargeText: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: width * 0.07,
        color: thirtiary,
        marginVertical: height * 0.02,
    },
    amountContainer: {
        flexDirection: "row",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: primary,
        paddingVertical: width * 0.02,
        paddingHorizontal: width * 0.04,
        alignItems: 'center',
    },
    amountRupee: {
        fontSize: width * 0.1,
        color: thirtiary,
        marginRight: width * 0.02,
    },
    amountField: {
        fontSize: width * 0.1,
        color: thirtiary,
        letterSpacing: width * 0.01,
    },
    buttonContainer: {
        paddingVertical: width * 0.03,
        paddingHorizontal: width * 0.06,
        backgroundColor: primary,
        borderRadius: 10,
        marginTop: height * 0.02,
    },
    button: {
        fontSize: width * 0.05,
        color: thirtiary,
        fontFamily: "Montserrat-Medium",
    },
});
