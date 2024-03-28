import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard, ActivityIndicator } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { Colors, Fonts, FontSize } from '../common/ConstantStyles';
import { Icon } from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import PropTypes from 'prop-types';
import { API_BASE } from '../setupProxy';

const ChangePassword = ({ navigation, route }) => {

    const { userid } = route.params;

    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const changePassword = async() => {

        console.log("userid: " + userid + " currentPassword: " + currentPassword + " newPassword: " + newPassword + " confirmPassword: " + confirmPassword);

        if (Keyboard.isVisible) {
            Keyboard.dismiss();
        }

        if (!currentPassword && !newPassword && !confirmPassword) {
            Snackbar.show({ text: 'Please enter password', duration: Snackbar.LENGTH_SHORT })
        }
        else if (!currentPassword) {
            Snackbar.show({ text: 'Please enter current password', duration: Snackbar.LENGTH_SHORT })
        }
        else if (currentPassword.length < 6) {
            Snackbar.show({ text: 'Please enter 6 character password', duration: Snackbar.LENGTH_SHORT })
        }
        else if (!newPassword) {
            Snackbar.show({ text: 'Please enter new password', duration: Snackbar.LENGTH_SHORT })
        }
        else if (newPassword.length < 6) {
            Snackbar.show({ text: 'Please enter 6 character new password', duration: Snackbar.LENGTH_SHORT })
        }
        else if (currentPassword === newPassword) {
            Snackbar.show({ text: 'Current Password and New Password are same. Please Enter Different Password.', duration: Snackbar.LENGTH_LONG })
        }
        else if (!confirmPassword) {
            Snackbar.show({ text: 'Please enter confirm password', duration: Snackbar.LENGTH_SHORT })
        }
        else if (newPassword !== confirmPassword) {
            Snackbar.show({ text: 'Password does not match', duration: Snackbar.LENGTH_SHORT })
        }

        else {

            setLoading(true);

            let toInput = {
                userid: userid,
                password: currentPassword,
                newpassword: newPassword
            };

            await fetch(`${API_BASE}/app/password/change`, {
                method: "POST",
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(toInput)
            })
                .then((response) => response.json())
                .then((response) => {

                    console.log("Change Password: " + JSON.stringify(response.message));
                    setLoading(false);
                    Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT })

                    if (response.code === 1) {
                        navigation.goBack();
                    }

                })
                .catch((error) => {
                    setLoading(false);
                    console.error('CHANGE PASSWORD There was an error!', error);
                    Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
                })
        }
    }


    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View>

                    {loading ?
                        <ActivityIndicator />
                        :
                        <View>
                            <View>
                                <View style={styles.textInputView}>
                                    <Icon name="password" type="material-icons" size={20} color={Colors.lightGrey} />
                                    <TextInput
                                        placeholder='Current Password'
                                        secureTextEntry={!showCurrentPassword}
                                        placeholderTextColor={Colors.lightGrey}
                                        style={styles.text}
                                        value={currentPassword}
                                        onChangeText={(currentPassword) => setCurrentPassword(currentPassword)}
                                    />
                                    <Icon name={showCurrentPassword ? 'visibility' : 'visibility-off'} type="material-icons" size={20} color={Colors.lightGrey} onPress={() => { setShowCurrentPassword(!showCurrentPassword); }} />
                                </View>

                                <View style={styles.textInputView}>
                                    <Icon name="password" type="material-icons" size={20} color={Colors.lightGrey} />
                                    <TextInput
                                        placeholder='New Password'
                                        secureTextEntry={!showNewPassword}
                                        placeholderTextColor={Colors.lightGrey}
                                        style={styles.text}
                                        value={newPassword}
                                        onChangeText={(newPassword) => setNewPassword(newPassword)}
                                    />
                                    <Icon name={showNewPassword ? 'visibility' : 'visibility-off'} type="material-icons" size={20} color={Colors.lightGrey} onPress={() => { setShowNewPassword(!showNewPassword); }} />
                                </View>

                                <View style={styles.textInputView}>
                                    <Icon name="password" type="material-icons" size={20} color={Colors.lightGrey} />
                                    <TextInput
                                        placeholder='Confirm Password'
                                        secureTextEntry={!showConfirmPassword}
                                        placeholderTextColor={Colors.lightGrey}
                                        style={styles.text}
                                        value={confirmPassword}
                                        onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                                    />
                                    <Icon name={showConfirmPassword ? 'visibility' : 'visibility-off'} type="material-icons" size={20} color={Colors.lightGrey} onPress={() => { setShowConfirmPassword(!showConfirmPassword); }} />
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.touchableOpacity} onPress={() => { changePassword() }}>
                                    <Text style={styles.buttonText}>Change Password</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

ChangePassword.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
};


export default ChangePassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    textInputView: {
        marginVertical: 10,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: Colors.lightGrey,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: "center"
    },
    text: {
        fontFamily: Fonts.regular,
        flex: 1,
        marginHorizontal: 10,
        marginTop: 5,
        color: Colors.black
    },
    touchableOpacity: {
        backgroundColor: Colors.primary,
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 50,
        padding: 12
    },
    buttonText: {
        color: Colors.white,
        textAlign: "center",
        fontSize: FontSize.medium,
        fontFamily: Fonts.bold,
    },
});
