import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors, FontSize } from '../common/ConstantStyles'
import PropTypes from 'prop-types';

const StaffStockListItem = ({item, index}) => {

    return (
        <View>
            <TouchableOpacity onPress={() => { }}>

                <View style={styles.itemContent}>
                    <Text style={styles.tblIndexContent} >{index + 1}</Text>
                    <Text style={styles.tblNameContent} >{item.name}</Text>
                    <Text style={styles.tblOtherContent} >{item.received}</Text>
                    <Text style={styles.tblOtherContent} >{item.consumed}</Text>
                    <Text style={styles.tblOtherContent} >{item.currentstock}</Text>
                    <Text style={styles.tblOtherContent} >{item.returned}</Text>
                </View>

            </TouchableOpacity>
        </View>
    );
}

StaffStockListItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default StaffStockListItem

const styles = StyleSheet.create({
    itemContent: {
        flex: 1,
        padding: 5,
        backgroundColor: Colors.white,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    tblIndexContent: {
        flex: 0.5,
        color: Colors.black,
        fontSize: FontSize.smallMedium,
    },
    tblNameContent: {
        flex: 3,
        color: Colors.black,
        fontSize: FontSize.smallMedium,
    },
    tblOtherContent: {
        flex: 1.5,
        color: Colors.black,
        fontSize: FontSize.smallMedium,
        textAlign: "right"
    },
});