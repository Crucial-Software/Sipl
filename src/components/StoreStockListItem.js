import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors, FontSize } from '../common/ConstantStyles'
import PropTypes from 'prop-types';

const StoreStockListItem = ({ item, index }) => {

    return (
        <View>
            <TouchableOpacity onPress={() => { }}>

                <View style={styles.itemContent}>
                    <Text style={{ flex: 0.5, color: Colors.black, fontSize: FontSize.smallMedium, }} >{index + 1}</Text>
                    <Text style={{ flex: 3, color: Colors.black, fontSize: FontSize.smallMedium, }} >{item.product.name}</Text>
                    <Text style={{ flex: 1.5, color: Colors.black, fontSize: FontSize.smallMedium, }} >{item.product.item_code}</Text>
                    <Text style={{ flex: 1.25, color: Colors.black, fontSize: FontSize.smallMedium, textAlign: "right" }} >{item.stock}</Text>
                </View>

            </TouchableOpacity>
        </View>

    );
}

StoreStockListItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default StoreStockListItem

const styles = StyleSheet.create({
    itemContent: {
        flex: 1,
        padding: 5,
        backgroundColor: Colors.white,
        flexDirection: "row",
        justifyContent: "space-between"
    },
});