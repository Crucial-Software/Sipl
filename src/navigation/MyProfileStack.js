import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors, Fonts, FontSize } from '../common/ConstantStyles';
import { Icon } from 'react-native-elements';
import MyProfile from '../screens/MyProfile';
import ChangePassword from '../screens/ChangePassword';
import PropTypes from 'prop-types';

const Stack = createStackNavigator();

const MyProfileStack = ({ navigation }) => {

    return (
        <Stack.Navigator>

            <Stack.Screen
                name="User Profile"
                component={MyProfile}
                options={{
                    title: "My Profile",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },
                    headerLeft: (props) => (
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <Icon name='menu' type='material-icon' size={25} iconStyle={{ marginStart: 20 }} color={Colors.white} />
                        </TouchableOpacity>
                    ),

                }}
            />

            <Stack.Screen
                name="Change Password"
                component={ChangePassword}
                options={{
                    title: "Change Password",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

        </Stack.Navigator>
    );
}

MyProfileStack.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default MyProfileStack