import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import ForgotPassword from '../screens/ForgotPassword';
import { Colors, Fonts, FontSize } from '../common/ConstantStyles';

const Stack = createStackNavigator();

const LoginStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="LoginScreen"
                component={Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Forgot Password"
                component={ForgotPassword}
                options={{
                    headerShown: false,
                    headerTitleAlign: "center",
                    headerStyle: {
                        backgroundColor: Colors.primaryViolet,
                    },
                    headerTitleStyle: {
                        fontFamily: Fonts.semiBold,
                        fontSize: FontSize.medium
                    }
                }}
            />
        </Stack.Navigator>
    );
}

export default LoginStack