import {View , Text , StyleSheet , TouchableOpacity , Dimensions , Image} from "react-native"
import { primary, secondary, thirtiary  } from "../../../../utilities/color.js";
import {useState , useEffect} from "react"
const { height, width } = Dimensions.get("screen");


export default function TransactionHistory({navigation , data, setData}) {
    const [transactions , setTransactions] = useState([])

    useEffect(() => {
        setTransactions(data.transactionHistory)
    } , [data])
    return (
         <View style={styles.Container}>
            <View style={styles.topContainer}>
               <TouchableOpacity style={styles.back}>
                    <Image 
                        source={require("")}
                    />
                </TouchableOpacity> 
            </View>
        </View>
  )
}

const styles = StyleSheet.create({
    Container : {
        flex : 1,
        backgroundColor : secondary,
        paddingHorizontal : "5%",
        paddingVertical : "5%"
    },
    topContainer : {
        flexDirection : "row",
        alignItems: 'center',
    },
    back : {
        height : height * 0.05,
        aspectRatio : 1,
    }
})