import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors, FontSize, Fonts } from './ConstantStyles'

const NoDataFound = () => {

    return (

        <View style={styles.container}>
            <Text style={styles.noDataFound}>No Data Found</Text>
        </View>

    )
}

export default NoDataFound

const styles = StyleSheet.create({
    container: {
        alignItems: "center", margin: 30
    },
    noDataFound: {
        color: Colors.lightGrey,
        fontSize: FontSize.smallMedium,
        fontFamily: Fonts.regular,
    },
});