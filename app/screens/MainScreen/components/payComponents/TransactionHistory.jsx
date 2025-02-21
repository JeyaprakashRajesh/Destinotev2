import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, FlatList } from "react-native";
import { primary, secondary, thirtiary } from "../../../../utilities/color.js";
import { useState, useEffect } from "react";

const { height, width } = Dimensions.get("screen");

export default function TransactionHistory({ navigation, data }) {
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        if (data.transactionHistory) {
            const sortedTransactions = [...data.transactionHistory].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            );
            setTransactions(sortedTransactions);
        }
    }, [data]);

    const renderTransactionItem = ({ item }) => {
        const transactionDate = new Date(item.date);
        const formattedTime = transactionDate.toLocaleTimeString("en-US", { 
            hour: "2-digit", 
            minute: "2-digit", 
            hour12: true 
        });
        const formattedDate = transactionDate.toLocaleDateString("en-GB", { 
            day: "2-digit", 
            month: "short", 
            year: "numeric" 
        });

        return (
            <View style={[styles.transactionItem, { backgroundColor: item.operation === "credit" ? "#4c8555" : "#854848" }]}>
                <View style={styles.transactionContent}>
                    <Text style={styles.transactionTime}>{formattedTime}</Text>
                    <Text style={styles.transactionDate}>{formattedDate}</Text>
                </View>
                <View style={styles.transactionAmountContainer}>
                    <Text style={[styles.transactionAmount, { color: item.operation === "credit" ? "#00d423" : "#ff3636" }]}>
                        Rs. {item.transactionAmount}
                    </Text>
                </View>
            </View>
        );
    };

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
                    <TouchableOpacity
                        style={[
                            styles.sortingElement,
                            { borderColor: filter === "credit" ? "#00d423" : "#4c8555" },
                        ]}
                        onPress={() => setFilter(filter === "credit" ? "" : "credit")}
                    >
                        <Text style={[styles.sortingText, { color: "#00d423" }]}>Credit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.sortingElement,
                            { borderColor: filter === "debit" ? "#ff3636" : "#854848"},
                        ]}
                        onPress={() => setFilter(filter === "debit" ? "" : "debit")}
                    >
                        <Text style={[styles.sortingText, { color: "#ff3636" }]}>Debit</Text>
                    </TouchableOpacity>
                </View>

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
        paddingHorizontal: 20,
    },
    transactionContent: {
        marginVertical: 20,
        flexDirection: "column",
        gap: 5,
    },
    transactionTime: {
        fontSize: 25,
        fontFamily: "Montserrat-SemiBold",
        color: thirtiary,
    },
    transactionDate: {
        fontSize: 15,
        fontFamily: "Montserrat-Medium",
        color: thirtiary,
    },
    transactionAmountContainer: {
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
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
        alignItems: "center",
    },
    sortingInnerContainer: {
        flex: 0.7,
        flexDirection: "row",
        justifyContent: "space-between",
        height: "100%",
        alignItems: "center",
    },
    exportContainer: {
        height: "70%",
        backgroundColor: primary,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
    },
    exportText: {
        fontSize: width * 0.04,
        fontFamily: "Montserrat-SemiBold",
        marginRight: width * 0.03,
    },
    exportImage: {
        height: "100%",
        width: width * 0.05,
        marginHorizontal: width * 0.03,
    },
    sortingElement: {
        width: "48%",
        height: "70%",
        borderRadius: 10,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    sortingText: {
        fontSize: width * 0.03,
        fontFamily: "Montserrat-Medium",
    },
});
