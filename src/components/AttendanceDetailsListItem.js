import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types';
import moment from 'moment';
import { Colors, FontSize } from '../common/ConstantStyles';

const AttendanceDetailsListItem = ({ item, index, navigation }) => {

    return (
        <View style={item.totalhrs === 0 ? styles.itemContentLightRed : styles.itemContentLightGreen}>
            <Text style={styles.itemText} >{moment(item.fordate).format("DD-MMM-YYYY")}</Text>
            <Text style={styles.itemText} >{item.intime === null? "N/A":moment(item.intime).format("DD-MMM-YYYY HH:mm:ss")}</Text>
            <Text style={styles.itemText} >{item.outtime === null? "N/A":moment(item.outtime).format("DD-MMM-YYYY HH:mm:ss")}</Text>
            <Text style={styles.itemText} >{Math.round(item.totalhours).toFixed(2)} hrs</Text>
        </View>

    );
};

AttendanceDetailsListItem.propTypes = {
    navigation: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default AttendanceDetailsListItem

const styles = StyleSheet.create({
    itemContentLightGreen: {
        flex: 1,
        padding: 5,
        backgroundColor: Colors.lightGreen1,
        flexDirection: "row",
        justifyContent: "space-between"
      },
      itemContentLightRed: {
        flex: 1,
        padding: 5,
        backgroundColor: Colors.lightRed1,
        flexDirection: "row",
        justifyContent: "space-between"
      },
      itemText: {
        flex: 1,
        color: Colors.black,
        fontSize: FontSize.smallMedium,
      },
});