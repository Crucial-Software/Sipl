import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import { Colors, FontSize, Fonts } from '../common/ConstantStyles';

const NotificationsListItem = ({ item, index, navigation }) => {

    return (
        <View>

            <TouchableOpacity onPress={() => { }} style={styles.itemContainer}>

                <Icon name='circle-notifications' type='material-icon' size={50} iconStyle={{ marginEnd: 5 }} color={Colors.primaryLight2} />

                <View style={styles.outerView}>
                    <Text style={styles.itemTextHeading}>{item.title}</Text>
                    <Text style={styles.itemTextContent}>{item.details}</Text>
                    <Text style={styles.itemTextContentSmall}>{moment(item.created_at).format("DD-MMM-YYYY")}</Text>
                </View>

            </TouchableOpacity>
        </View>

    );
};

NotificationsListItem.propTypes = {
    navigation: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default NotificationsListItem

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
        flex: 1,
        flexDirection: "row"
    },
    outerView: {
        flex: 1,
    },
    itemTextHeading: {
        color: Colors.black,
        fontFamily: Fonts.bold,
        fontWeight: "bold",
        padding: 2
    },
    itemTextContent: {
        color: Colors.darkGrey,
        fontFamily: Fonts.regular,
        padding: 2
    },
    itemTextContentSmall: {
        color: Colors.lightGrey,
        fontFamily: Fonts.regular,
        fontSize: FontSize.small,
        padding: 2
    },
});