import React, { useContext, useEffect } from 'react';
import { View, ActivityIndicator, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { AuthContext } from './AuthProvider';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from 'prop-types';

const Routes = ({ navigation }) => {

    useEffect(() => {
        requestNotificationPermission();
    }, [])

    const requestNotificationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            console.log("" + granted);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                requestUserPermission();
            } else {
                requestUserPermission();
                console.log('Notification permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };
    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            console.log('Authorization status:', authStatus);
            const token = await messaging().getToken();
            if (token) {
                console.log("Token: " + token);
                AsyncStorage.setItem('firebaseUserToken', token);

                messaging().onMessage(async remoteMessage => {
                    console.log('A new FCM message arrived!', remoteMessage.notification);
                });

                messaging().onNotificationOpenedApp(notificationOpen => {
                    console.log('Notification opened!', notificationOpen);
                });

                messaging().getInitialNotification().then(remoteMessage => {
                    console.log("Initial Notification: ", remoteMessage.notification);
                })

            } else {
                AsyncStorage.setItem('firebaseUserToken', "Not Available");
            }
        } else {
            console.log('REQUEST USER MESSAGING PERMISSION DENIED');
        }
        
    }

    const { isLoading, userId } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size={'small'} />
            </View>
        )
    }

    return (

        <NavigationContainer>
            {userId !== null ? <AppStack /> : <AuthStack />}
        </NavigationContainer>

    );
}

Routes.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default Routes;