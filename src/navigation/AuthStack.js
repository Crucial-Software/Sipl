import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen'
import LoginStack from './LoginStack';

const Stack = createNativeStackNavigator();

const AuthStack = () => {

    return (
        <Stack.Navigator initialRouteName={SplashScreen}>
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Login' component={LoginStack} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default AuthStack;