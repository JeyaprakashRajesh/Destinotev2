import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, FlatList, Platform } from "react-native";
import { primary, secondary, thirtiary } from "../../../../utilities/color.js";
import { useState, useEffect } from "react";

const { height, width } = Dimensions.get("screen");

export default function TransactionHistory({ navigation, data, setData }) {
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        setTransactions(data.transactionHistory);
    }, [data]);

    const renderTransactionItem = ({ item }) => (
        <View style={[styles.transactionItem, { backgroundColor: item.operation === "credit" ? "#4c8555" : "#854848" }]} >
            <View style={styles.transactionContent}>
                <Text style={styles.transactionTime}>4:10pm</Text>
                <Text style={styles.transactionDate}>22 Jan 2025</Text>
            </View>
            <View style={styles.transactionAmountContainer}>
                <Text style={[styles.transactionAmount, { color: item.operation === "credit" ? "#00d423" : "#ff3636" }]} >
                    Rs. {item.transactionAmount}
                </Text>
            </View>
        </View>
    );

    const filteredTransactions = filter
        ? transactions.filter(item => item.operation === filter)
        : transactions;

    return (
        <View style={styles.Container}>
            <View style={styles.topContainer}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <Image
                        source={require("../../../../assets/pictures/back.png")}
                        style={styles.backImg}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.topText}>Transactions</Text>
            </View>
            <View style={styles.sortingContainer}>
                <View style={styles.sortingInnerContainer}>
                    {/* Credit Button */}
                    <TouchableOpacity
                        style={[
                            styles.sortingElement,
                            { borderColor: filter === "credit" ? "#00d423" : "#4c8555" },
                        ]}
                        onPress={() => setFilter(filter === "credit" ? "" : "credit")}
                    >
                        <Text
                            style={[
                                styles.sortingText,
                                { color: "#00d423" },
                            ]}
                        >
                            Credit
                        </Text>
                    </TouchableOpacity>

                    {/* Debit Button */}
                    <TouchableOpacity
                        style={[
                            styles.sortingElement,
                            { borderColor: filter === "debit" ? "#ff3636" : "#854848"},
                        ]}
                        onPress={() => setFilter(filter === "debit" ? "" : "debit")}
                    >
                        <Text
                            style={[
                                styles.sortingText,
                                { color: "#ff3636" },
                            ]}
                        >
                            Debit
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Export Button */}
                <TouchableOpacity style={styles.exportContainer}>
                    <Image
                        source={require("../../../../assets/pictures/export.png")}
                        style={styles.exportImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.exportText}>EXPORT</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
                <FlatList
                    data={filteredTransactions}
                    keyExtractor={(item) => item._id}
                    renderItem={renderTransactionItem}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: secondary,
        paddingHorizontal: "5%",
        paddingVertical: "7%",
    },
    topContainer: {
        flexDirection: "row",
        alignItems: 'center',
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
    listContainer: {
        flex: 1,
        marginTop: "5%",
    },
    transactionItem: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20
    },
    transactionContent: {
        marginVertical: 20,
        flexDirection: "column",
        gap: 5
    },
    transactionTime: {
        fontSize: 25,
        fontFamily: "Montserrat-SemiBold",
        color: thirtiary
    },
    transactionDate: {
        fontSize: 15,
        fontFamily: "Montserrat-Medium",
        color: thirtiary
    },
    transactionAmountContainer: {
        height: "100%",
        flexDirection: "row",
        alignItems: 'center',
    },
    transactionAmount: {
        fontSize: width * 0.06,
        fontFamily: "JosefinSans-SemiBold",
        marginTop: width * 0.015,
    },
    sortingContainer: {
        height: height * 0.07,
        width: "100%",
        marginTop: "5%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    sortingInnerContainer: {
        flex: 0.7,
        flexDirection: "row",
        justifyContent: "space-between",
        height: "100%",
        alignItems: 'center',
    },
    exportContainer: {
        height: "70%",
        backgroundColor: primary,
        flexDirection: "row",
        alignItems: 'center',
        borderRadius: 10
    },
    exportText: {
        fontSize: width * 0.04,
        fontFamily: "Montserrat-SemiBold",
        marginRight: width * 0.03
    },
    exportImage: {
        height: "100%",
        width: width * 0.05,
        marginHorizontal: width * 0.03
    },
    sortingElement: {
        width: "48%",
        height: "70%",
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sortingText: {
        fontSize: width * 0.03,
        fontFamily: "Montserrat-Medium"
    }
});
