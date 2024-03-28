import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors, Fonts, FontSize } from '../common/ConstantStyles';
import { Icon } from 'react-native-elements';
import AttendanceSummary from '../screens/AttendanceSummary';
import AttendanceDetails from '../screens/AttendanceDetails';
import PropTypes from 'prop-types';

const Stack = createStackNavigator();

const AttendanceStack = ({ navigation }) => {

    return (
        <Stack.Navigator>

            <Stack.Screen
                name="Attendance Summary"
                component={AttendanceSummary}
                options={{
                    title: "Attendance",
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
                name="Attendance Details"
                component={AttendanceDetails}
                options={{
                    title: "Attendance Details",
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

AttendanceStack.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default AttendanceStack