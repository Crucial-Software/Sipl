import React, { useContext } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';
import { Colors, Fonts } from "../common/ConstantStyles";
import PropTypes from 'prop-types';
import { AuthContext } from "../navigation/AuthProvider";

const CustomDrawer = (props, { navigation }) => {

    const { logout } = useContext(AuthContext);

    const logoutUser = () => {
        props.navigation.closeDrawer();
        logout();
    }

    return (
        <View style={styles.container}>

            <DrawerContentScrollView {...props} contentContainerStyle={{}}>

                <Image style={styles.applogo} source={require('../assets/images/sipl_logo.png')} />

                <View style={{ borderTopWidth: 1, borderTopColor: Colors.grey, marginVertical: 10 }} />

                <DrawerItemList {...props} />

            </DrawerContentScrollView>

            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: Colors.grey }}>
                <TouchableOpacity style={{ paddingVertical: 5 }} onPress={() => { logoutUser() }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="logout" type="material-icons" size={20} color={Colors.darkGrey} />
                        <Text style={{ marginLeft: 30, color: Colors.darkGrey, fontFamily: Fonts.semiBold }}>Logout</Text>
                    </View>
                </TouchableOpacity>
            </View>

        </View>
    )
}

CustomDrawer.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default CustomDrawer;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    applogo: {
        width: 150,
        height: 100,
        marginHorizontal: 20,
        marginTop: 40,
    },

});