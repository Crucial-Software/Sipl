/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

PushNotification.configure({
    onRegister: function(token) {
        console.log("TOKEN in app :", token.token);
        AsyncStorage.setItem('firebaseUserToken', token.token);
        },
    onNotification: function(notification) {
        console.log("NOTIFICATION:", notification);
        },
    onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATIONACTION:", notification);
        },
    senderID: "1090501687137",
    popInitialNotification: true,
    requestPermissions: true
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
