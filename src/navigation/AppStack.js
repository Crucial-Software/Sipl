import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';
import { Colors, FontSize, Fonts } from '../common/ConstantStyles';
import CustomDrawer from '../components/CustomDrawer';
import DashboardStack from './DashboardStack';
import AttendanceStack from './AttendanceStack';
import MyProfileStack from './MyProfileStack';

const Drawer = createDrawerNavigator();

const AppStack = () => {

    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawer {...props} />}
            initialRouteName={DashboardStack}
            screenOptions={{
                drawerActiveBackgroundColor: Colors.primary,
                drawerActiveTintColor: Colors.white,
                drawerLabelStyle: { fontFamily: Fonts.semiBold },
                headerTitleAlign: 'center',
                headerTitleStyle: { fontFamily: Fonts.semiBold, fontSize: FontSize.medium }
            }}
        >
            <Drawer.Screen
                name="Dashboard"
                component={DashboardStack}
                options={{
                    headerShown: false,
                    drawerIcon: ({ color }) => (<Icon name="dashboard" type="material-icons" size={20} color={color} />)
                }}
            />

            <Drawer.Screen
                name="My Profile"
                component={MyProfileStack}
                options={{
                    headerShown: false,
                    drawerIcon: ({ color }) => (<Icon name="person" type="material-icons" size={20} color={color} />)
                }}
            />

            <Drawer.Screen
                name="Attendance"
                component={AttendanceStack}
                options={{
                    headerShown: false,
                    drawerIcon: ({ color }) => (<Icon name="task" type="material-icons" size={20} color={color} />)
                }}
            />

        </Drawer.Navigator>
    );
}

export default AppStack