import { View , Text , StyleSheet , Dimensions } from "react-native";
import { primary, secondary, thirtiary , secondaryAcent} from "../utilities/color";


const { height, width } = Dimensions.get("screen");
export default function Pay() {
    return(
        <View style={styles.container}>
            <View style={styles.pay}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : secondaryAcent
    },
    pay : {
        height : height * 0.4,
        backgroundColor : "white"
    }
})