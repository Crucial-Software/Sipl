import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors, Fonts } from '../common/ConstantStyles'
import PropTypes from 'prop-types';
import moment from 'moment';

const MyAmcListItem = ({ item, index, navigation, staffId, functionGetWork }) => {

    return (
        <View>
            <TouchableOpacity onPress={() => { navigation.navigate("AMC Details", { workDetailsItem: item, staffId: staffId, functionGetWork: (staffId) => functionGetWork(staffId) }) }}
                style={item.staffworkstatus == "Completed" ? styles.itemContainer1 : styles.itemContainer}>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Works Id:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.works_id ? item.works_id : ""}</Text>
                    </View>
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Customer Name:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.customer_name ? item.customer_name : ""}</Text>
                    </View>
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Address:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>
                            {item.houseno ? item.houseno : null}, {item.street1 ? item.street1 : ""}, {item.street2 ? item.street2 : ""}, {item.street3 ? item.street3 : ""}, {item.city ? item.city : ""}
                        </Text>
                    </View>
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Assign DateTime:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.assigneddatetime ? moment(item.assigneddatetime).format("DD-MMM-YYYY") : ""}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        </View>

    );
}

MyAmcListItem.propTypes = {
    navigation: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    staffId: PropTypes.string.isRequired,
    functionGetWork: PropTypes.func.isRequired
};

export default MyAmcListItem

const styles = StyleSheet.create({
    itemContainer: {
        borderRadius: 5,
        backgroundColor: Colors.white,
        shadowColor: Colors.darkGrey,
        elevation: 10,
        margin: 10,
        padding: 10,
        borderWidth: 0.5,
        borderColor: Colors.primary,
    },
    itemContainer1: {
        borderRadius: 5,
        backgroundColor: Colors.lightGreen1,
        shadowColor: Colors.darkGrey,
        elevation: 10,
        margin: 10,
        padding: 10,
        borderWidth: 0.5,
        borderColor: Colors.primary,
    },
    outerView: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    innerHeadingView: {
        flex: 1,
        alignSelf: 'stretch',
    },
    innerView: {
        flex: 2,
        alignSelf: 'stretch',
    },
    itemTextHeading: {
        color: Colors.black,
        fontFamily: Fonts.bold,
        fontWeight: "bold",
    },
    itemTextViewImageHeading: {
        color: Colors.primary,
        fontFamily: Fonts.bold,
        fontWeight: "bold",
    },
    itemTextContent: {
        color: Colors.darkGrey,
        fontFamily: Fonts.regular,
    },
    touchableOpacityPhoto: {
        width: 100,
        marginVertical: 2,
        marginHorizontal: 5,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        padding: 5,
    },
    touchableOpacityImages: {
        width: 110,
        marginVertical: 2,
        marginHorizontal: 5,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        padding: 5,
    },
    touchableOpacity: {
        width: 75,
        backgroundColor: Colors.primary,
        borderRadius: 50,
        padding: 8,
    },
    buttonTextPhoto: {
        color: Colors.primary,
        textAlign: "center",
        fontFamily: Fonts.semiBold,
        marginStart: 5
    },
    buttonText: {
        color: Colors.white,
        textAlign: "center",
        fontFamily: Fonts.bold,
    },
    contentViewStyle: {
        margin: 5,
        flex: 1
    },
    textHeading: {
        color: Colors.primary,
    },
    textContent: {
        color: Colors.black,
        paddingTop: 10,
        paddingBottom: 5,
    },
    viewStyle: {
        backgroundColor: Colors.primary,
        height: 1,
    },
    imageContent: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 5,
        padding: 5,
        marginVertical: 5,
        flex: 1
    },
    imageStyle: {
        width: 75,
        height: 75,
        resizeMode: 'contain',
        margin: 5,
        backgroundColor: Colors.white
    }
});