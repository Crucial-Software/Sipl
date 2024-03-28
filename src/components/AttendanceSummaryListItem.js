import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types';
import moment from 'moment';
import { Colors, FontSize, Fonts } from '../common/ConstantStyles';

const AttendanceSummaryListItem = ({ item, index, navigation }) => {

    const absentData = parseFloat(item.Total) - parseFloat(item.Attend);

    let monthName = moment(item.Month, 'M').format('MMM');
    let monthValue = moment(item.Month, 'M').format('MM');

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date();
    let currMonth = months[d.getMonth()];

    return (
        <View>

            <TouchableOpacity
                onPress={() => { navigation.navigate("Attendance Details", { year: item.Year, monthValue: monthValue, month: monthName, total: item.Total, present: item.Attend, currMonth: currMonth }) }}
                style={styles.itemContainer}>

                <View style={styles.itemContent}>
                    <Text style={styles.itemTextHeading} >{monthName} - {item.Year}</Text>
                    <View style={styles.itemSubContent}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemTextSubHeadingTotalHeading} >Total</Text>
                            <Text style={styles.itemTextSubHeadingTotal} >{item.Total} days</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemTextSubHeadingPresentHeading} >Present</Text>
                            <Text style={styles.itemTextSubHeadingPresent} >{item.Attend} days</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemTextSubHeadingAbsentHeading} >Absent</Text>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <View>
                                    {monthName !== currMonth ? <Text style={styles.itemTextSubHeadingAbsent}>{absentData}</Text> : <Text style={styles.itemTextSubHeadingAbsent}>0</Text>}
                                </View>
                                <View>
                                    <Text style={styles.itemTextSubHeadingAbsent}> days</Text>
                                </View>

                            </View>
                        </View>

                    </View>

                </View>

            </TouchableOpacity>
        </View>

    );
};

AttendanceSummaryListItem.propTypes = {
    navigation: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default AttendanceSummaryListItem

const styles = StyleSheet.create({
    itemContainer: {
        borderRadius: 5,
        backgroundColor: Colors.white,
        shadowColor: Colors.darkGrey,
        elevation: 10,
        margin: 10,
        borderWidth: 0.5,
        borderColor: Colors.primary,
    },
    itemContent: {
        padding: 10,
    },
    itemSubContent: {
        flex: 1,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    itemTextHeading: {
        color: Colors.black,
        fontFamily: Fonts.bold,
        fontWeight: "bold",
        fontSize: FontSize.medium,
    },
    itemTextSubHeadingTotalHeading: {
        flex: 1,
        textAlign: "center",
        color: Colors.primary,
        fontFamily: Fonts.regular,
        fontSize: FontSize.smallMedium,
    },
    itemTextSubHeadingTotal: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
        color: Colors.primary,
        fontFamily: Fonts.regular,
        fontSize: FontSize.smallMedium,
    },
    itemTextSubHeadingPresentHeading: {
        flex: 1,
        textAlign: "center",
        color: Colors.lightGreen,
        fontFamily: Fonts.regular,
        fontSize: FontSize.smallMedium,
    },
    itemTextSubHeadingPresent: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
        color: Colors.lightGreen,
        fontFamily: Fonts.regular,
        fontSize: FontSize.smallMedium,
    },
    itemTextSubHeadingAbsentHeading: {
        flex: 1,
        textAlign: "center",
        color: Colors.red,
        fontFamily: Fonts.regular,
        fontSize: FontSize.smallMedium,
    },
    itemTextSubHeadingAbsent: {
        flex: 1,
        textAlign: "center",
        fontWeight: "bold",
        color: Colors.red,
        fontFamily: Fonts.regular,
        fontSize: FontSize.smallMedium,
    },
});