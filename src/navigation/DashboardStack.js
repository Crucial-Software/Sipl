import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors, Fonts, FontSize } from '../common/ConstantStyles';
import { Icon, Badge } from 'react-native-elements';
import Dashboard from '../screens/Dashboard';
import SalarySlip from '../screens/SalarySlip';
import SalarySlipDetails from '../screens/SalarySlipDetails';
import Work from '../screens/Work';
import WorkDetails from '../screens/WorkDetails';
import StoreInventory from '../screens/StoreInventory';
import MaterialUsed from '../screens/MaterialUsed';
import PropTypes from 'prop-types';
import EmergencyInventory from '../screens/EmergencyInventory';
import SelectWork from '../screens/SelectWork';
import WorkDpr from '../screens/WorkDpr';
import WorkDprDetails from '../screens/WorkDprDetails';
import MaterialUsedDpr from '../screens/MaterialUsedDpr';
import IssueMaterial from '../screens/IssueMaterial';
import StaffInventory from '../screens/StaffInventory';
import ViewImageFile from '../screens/ViewImageFile';
import Notifications from '../screens/Notifications';
import Inventory from '../screens/Inventory';
import Emergency from '../screens/Emergency';
import AddEmergencyInventory from '../screens/AddEmergencyInventory';
import ReturnFromStaff from '../screens/ReturnFromStaff';
import AllTracker from '../screens/AllTracker';
import AllDpr from '../screens/AllDpr';
import AllEmergency from '../screens/AllEmergency';
import AddEmergency from '../screens/AddEmergency';

const Stack = createStackNavigator();

const DashboardStack = ({ navigation }) => {

    const [notificationBadge, setNotificationBadge] = useState(null);

    useEffect(() => {



    }, []);

    return (
        <Stack.Navigator>

            <Stack.Screen
                name="DashboardScreen"
                component={Dashboard}
                options={{
                    title: "SIPL",
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
                    headerRight: (props) => (
                        <TouchableOpacity onPress={() => { navigation.navigate("Notifications"); }}>
                            <Icon name='notifications' type='material-icon' size={25} iconStyle={{ marginEnd: 15 }} color={Colors.white} />
                            {notificationBadge !== null ?
                                <Badge
                                    status="error"
                                    value={notificationBadge}
                                    containerStyle={{ position: 'absolute', right: 10, top: -6 }}
                                /> : null}
                        </TouchableOpacity>
                    ),

                }}
            />

            <Stack.Screen
                name="Salary Slip"
                component={SalarySlip}
                options={{
                    title: "Salary Slip",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="Salary Slip Details"
                component={SalarySlipDetails}
                options={{
                    title: "Salary Slip Details",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="Work"
                component={SelectWork}
                options={{
                    title: "Work",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="Tracker"
                component={Work}
                options={{
                    title: "Tracker",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="Work Details"
                component={WorkDetails}
                options={{
                    title: "Work Details",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="Material Used"
                component={MaterialUsed}
                options={{
                    title: "Material Used",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="DPR"
                component={WorkDpr}
                options={{
                    title: "DPR",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="DPR Details"
                component={WorkDprDetails}
                options={{
                    title: "DPR Details",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="DPR Material Used"
                component={MaterialUsedDpr}
                options={{
                    title: "DPR Material Used",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="All Tracker"
                component={AllTracker}
                options={{
                    title: "All Tracker",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="All DPR"
                component={AllDpr}
                options={{
                    title: "All DPR",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="Emergency"
                component={Emergency}
                options={{
                    title: "Emergency",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="Emergency Inventory"
                component={EmergencyInventory}
                options={{
                    title: "Emergency Inventory",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="Add Emergency Inventory"
                component={AddEmergencyInventory}
                options={{
                    title: "Add Emergency Inventory",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="Add Emergency"
                component={AddEmergency}
                options={{
                    title: "Add Emergency",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="All Emergency"
                component={AllEmergency}
                options={{
                    title: "All Emergency",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="Issue Material"
                component={IssueMaterial}
                options={{
                    title: "Issue Material",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="View Image File"
                component={ViewImageFile}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },
                }}
            />

            <Stack.Screen
                name="Notifications"
                component={Notifications}
                options={{
                    title: "Notifications",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },
                }}
            />

            <Stack.Screen
                name="Inventory"
                component={Inventory}
                options={{
                    title: "Inventory",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="Staff Inventory"
                component={StaffInventory}
                options={{
                    title: "Staff Inventory",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="Store Inventory"
                component={StoreInventory}
                options={{
                    title: "Store Inventory",
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium },

                }}
            />

            <Stack.Screen
                name="Return From Staff"
                component={ReturnFromStaff}
                options={{
                    title: "Return From Staff",
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

DashboardStack.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default DashboardStack