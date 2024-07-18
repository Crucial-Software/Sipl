import React, { createContext, useState, useEffect } from "react";
import { Alert, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState("");
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userLastIn, setUserLastIn] = useState("");
    const [userLastOut, setUserLastOut] = useState("");
    const [userEmpDetails, setUserEmpDetails] = useState([]);
    const [userAccess, setUserAccess] = useState([]);
    const [staffId, setStaffId] = useState(null);

    const authlogin = (token, id, name, email, emp, lastin, lastout, access) => {
        console.log("AUTH PROVIDER SCREEN - token: " + token + " id: " + id + " name: " + name + " email: " + email + " " + JSON.stringify(emp) + " lastin: " + lastin + " lastout: " + lastout);
        console.log("AuthProvider CHECK SID: " + emp[0].id);
        console.log("AuthProvider CHECK access: " + JSON.stringify(access));
        const empDetails = JSON.stringify(emp);
        if (id) {
            setUserToken(token);
            setUserId(id);
            setUserName(name);
            setUserEmail(email);
            setUserLastIn(lastin);
            setUserLastOut(lastout);
            setUserEmpDetails(emp);
            setStaffId(emp[0].id);
            setUserAccess(access);
            AsyncStorage.setItem('userToken', JSON.stringify(token));
            AsyncStorage.setItem('userId', JSON.stringify(id));
            AsyncStorage.setItem('userName', JSON.stringify(name));
            AsyncStorage.setItem('userEmail', JSON.stringify(email));
            AsyncStorage.setItem('userLastIn', lastin);
            AsyncStorage.setItem('userLastOut', lastout);
            AsyncStorage.setItem('staffId', JSON.stringify(emp[0].id));
            AsyncStorage.setItem('userEmpDetails', empDetails).catch(err => {
                console.warn('Error storing todos in Async');
                console.warn(err);
            });
            AsyncStorage.setItem('userAccess', JSON.stringify(access)).catch(err => {
                console.log("Error in storing access");
            })
        }
    }

    const logout = () => {

        try {
            Alert.alert(
                'Signout',
                'Are you sure you want to Signout from this App?',
                [
                    { text: 'No', onPress: () => console.log('Cancel Pressed. App Not Exit') },
                    {
                        text: 'Yes', onPress: () => {
                            setIsLoading(true);
                            setUserToken("");
                            setUserId(null);
                            setUserName("");
                            setUserEmail("");
                            setUserLastIn("");
                            setUserLastOut("");
                            setUserEmpDetails([]);
                            setStaffId(null);
                            setUserAccess([]);
                            AsyncStorage.removeItem('userToken');
                            AsyncStorage.removeItem('userId');
                            AsyncStorage.removeItem('userName');
                            AsyncStorage.removeItem('userEmail');
                            AsyncStorage.removeItem('userLastIn');
                            AsyncStorage.removeItem('userLastOut');
                            AsyncStorage.removeItem('userEmpDetails');
                            AsyncStorage.removeItem('staffId')
                            AsyncStorage.removeItem('userAccess')
                            setIsLoading(false);
                            BackHandler.exitApp();
                        }
                    },
                ],
                {
                    cancelable: false
                }
            );

        } catch (e) {
            console.log(e);
        }

    }

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let uToken = await AsyncStorage.getItem('userToken');
            let uId = await AsyncStorage.getItem('userId');
            let uName = await AsyncStorage.getItem('userName');
            let uEmail = await AsyncStorage.getItem('userEmail');
            let uLastIn = await AsyncStorage.getItem('userLastIn');
            let uLastOut = await AsyncStorage.getItem('userLastOut');
            let uStaffId = await AsyncStorage.getItem('staffId');
            let uAccess = await AsyncStorage.getItem('userAccess');
            if (uId) {
                setUserToken(uToken);
                setUserId(uId);
                setUserName(uName);
                setUserEmail(uEmail);
                setUserLastIn(uLastIn);
                setUserLastOut(uLastOut);
                setStaffId(uStaffId);
                setUserAccess(uAccess);
            }

            AsyncStorage.getItem('userEmpDetails')
                .then(stringifiedEmpDetails => {
                    console.log('Restored Emp Details:');
                    console.log(stringifiedEmpDetails);

                    const parsedEmpDetails = JSON.parse(stringifiedEmpDetails);

                    if (!parsedEmpDetails || typeof parsedEmpDetails !== 'object') return;

                    setUserEmpDetails(parsedEmpDetails);
                })
                .catch(err => {
                    console.warn('AUTH PROVIDER: Error restoring Emp Details from async');
                    console.warn(err);
                });

            setIsLoading(false);
        } catch (error) {
            console.log(`isLoggedIn error: ${e}`);
        }
    }

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (

        <AuthContext.Provider value={{ authlogin, logout, isLoading, userToken, userId, userName, userEmail, userEmpDetails, userLastIn, userLastOut, userAccess }}>
            {children}
        </AuthContext.Provider>

    );

};

AuthProvider.propTypes = {
    children: PropTypes.object.isRequired,
};