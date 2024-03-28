import React, { useState, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard, ActivityIndicator } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { Colors, Fonts, FontSize } from '../common/ConstantStyles';
import { Icon } from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import PropTypes from 'prop-types';
import { API_BASE } from '../setupProxy';

const ForgotPassword = ({ navigation }) => {

  useLayoutEffect(() => {
    navigation.setOptions({ title: "" })
  }, []);

  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [enterMobileView, setEnterMobileView] = useState(true);
  const [enterOtpView, setEnterOtpView] = useState(false);
  const [enterResetPasswordView, setEnterResetPasswordView] = useState(false);

  const sendOtp = async () => {

    console.log("mobile: " + mobile);

    if (Keyboard.isVisible) {
      Keyboard.dismiss();
    }

    if (!mobile) {
      Snackbar.show({ text: 'Please enter mobile number', duration: Snackbar.LENGTH_SHORT })
    }
    else if (mobile.length != 10) {
      Snackbar.show({ text: 'Please enter 10 digit mobile number', duration: Snackbar.LENGTH_SHORT })
    }
    else if (isNaN(mobile) || mobile.includes("+") || mobile.includes("*") || mobile.includes(" ") || mobile.includes("#") || mobile.includes(".")) {
      Snackbar.show({ text: 'Please enter a valid mobile number', duration: Snackbar.LENGTH_SHORT })
    }
    else {

      setLoading(true);

      let toInput = {
        mobileno: mobile,
      };

      await fetch(`${API_BASE}/app/password/forgot`, {
        method: "POST",
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(toInput)
      })
        .then((response) => response.json())
        .then((response) => {

          setLoading(false);
          console.log("response otp: " + JSON.stringify(response))

          if (response.code === 1) {
            //otp will not be automatically filled
            setEnterMobileView(false);
            setEnterOtpView(true);
            setEnterResetPasswordView(false);
          } else if (response.code === 0) {
            Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT })
          } else if (response.code === 2) {
            console.log("res.msg: " + response.message);
            //otp will be automatically filled
            setOtp(response.message + "");
            setEnterMobileView(false);
            setEnterOtpView(true);
            setEnterResetPasswordView(false);
          }

        })
        .catch((error) => {
          setLoading(false);
          console.error('FORGOT PASSWORD There was an error!', error);
          Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
        })

    }

  }

  const checkOtp = async () => {

    console.log("otp: " + otp);

    if (Keyboard.isVisible) {
      Keyboard.dismiss();
    }

    if (!otp) {
      Snackbar.show({ text: 'Please enter otp', duration: Snackbar.LENGTH_SHORT })
    }
    else if (otp.length != 4) {
      Snackbar.show({ text: 'Please enter 4 digit otp', duration: Snackbar.LENGTH_SHORT })
    }
    else if (otp.includes("+") || otp.includes("*") || otp.includes(" ") || otp.includes("#") || otp.includes(".")) {
      Snackbar.show({ text: 'Please enter a valid otp', duration: Snackbar.LENGTH_SHORT })
    }
    else {

      setLoading(true);

      let toInput = {
        mobileno: mobile,
        otp: otp
      };

      await fetch(`${API_BASE}/app/password/verify`, {
        method: "POST",
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(toInput)
      })
        .then((response) => response.json())
        .then((response) => {

          setLoading(false);

          if (response.code === 1) {
            setEnterMobileView(false);
            setEnterOtpView(false);
            setEnterResetPasswordView(true);
          } else {
            Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT })
          }

        })
        .catch((error) => {
          setLoading(false);
          console.error('VERIFY OTP There was an error!', error);
          Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
        })

    }

  }

  const resetPassword = async() => {

    console.log("password: " + password + " confirmPassword: " + confirmPassword);

    if (Keyboard.isVisible) {
      Keyboard.dismiss();
    }

    if (!password && !confirmPassword) {
      Snackbar.show({ text: 'Please enter password and confirm password', duration: Snackbar.LENGTH_SHORT })
    }
    else if (!password) {
      Snackbar.show({ text: 'Please enter new password', duration: Snackbar.LENGTH_SHORT })
    }
    else if (password.length < 6) {
      Snackbar.show({ text: 'Please enter 6 character password', duration: Snackbar.LENGTH_SHORT })
    }
    else if (!confirmPassword) {
      Snackbar.show({ text: 'Please enter confirm password', duration: Snackbar.LENGTH_SHORT })
    }
    else if (password !== confirmPassword) {
      Snackbar.show({ text: 'Password does not match', duration: Snackbar.LENGTH_SHORT })
    }
    else {

      setLoading(true);

      let toInput = {
        mobileno: mobile,
        password: password
      };

      await fetch(`${API_BASE}/app/password/reset`, {
        method: "POST",
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(toInput)
      })
        .then((response) => response.json())
        .then((response) => {

          setLoading(false);

          Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT })

          if (response.code === 1) {
            setEnterMobileView(false);
            setEnterOtpView(false);
            setEnterResetPasswordView(false);
            navigation.navigate("LoginScreen");
          }

        })
        .catch((error) => {
          setLoading(false);
          console.error('RESET PASSWORD There was an error!', error);
          Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
        })

    }

  }

  return (

    <KeyboardAvoidingView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps='handled'>
        {loading ?
          <ActivityIndicator />
          :
          <View>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={{ paddingVertical: 15, flex: 1, flexDirection: "row" }}>
                <Icon name="west" type="material-icon" size={25} style={{ justifyContent: "flex-start", paddingHorizontal: 20 }} />
              </View>
            </TouchableOpacity>

            <View style={styles.headingView}>
              <Text style={styles.headingText}>Forgot Password</Text>
            </View>

            {enterMobileView ?
              <View>
                <View>
                  <View style={styles.centerView}>
                    <Text style={styles.text2}>Enter your registered mobile number. We will send you Otp to verify.</Text>
                  </View>
                  <View style={styles.textInputView}>
                    <Icon name="mobile" type="entypo" size={20} color={Colors.lightGrey} />
                    <TextInput
                      placeholder='Mobile'
                      keyboardType='numeric'
                      maxLength={10}
                      placeholderTextColor={Colors.lightGrey}
                      style={styles.text}
                      value={mobile}
                      onChangeText={(mobile) => setMobile(mobile)}
                    />
                  </View>
                </View>
                <View>
                  <TouchableOpacity style={styles.touchableOpacity} onPress={() => { sendOtp() }}>
                    <Text style={styles.buttonText}>Send OTP</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :
              null
            }

            {enterOtpView ?
              <View>
                <View>
                  <View style={styles.centerView}>
                    <Text style={styles.text2}>Enter the Otp which you recieved in sms.</Text>
                  </View>
                  <View style={styles.textInputView}>
                    <Icon name="123" type="material-icons" size={20} color={Colors.lightGrey} />
                    <TextInput
                      placeholder='Enter OTP'
                      keyboardType='numeric'
                      placeholderTextColor={Colors.lightGrey}
                      style={styles.text}
                      maxLength={4}
                      value={otp}
                      onChangeText={(otp) => setOtp(otp)}
                    />
                  </View>
                </View>
                <View>
                  <TouchableOpacity style={styles.touchableOpacity} onPress={() => { checkOtp() }}>
                    <Text style={styles.buttonText}>Check</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.touchableOpacityBorder}
                    onPress={() => {
                      setEnterMobileView(true);
                      setEnterOtpView(false);
                      setEnterResetPasswordView(false);
                    }}>
                    <Text style={styles.buttonTextBorder}>Resend OTP</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :
              null
            }

            {enterResetPasswordView ?
              <View>
                <View>
                  <View style={styles.centerView}>
                    <Text style={styles.text2}>Enter your new password</Text>
                  </View>

                  <View style={styles.textInputView}>
                    <Icon name="password" type="material-icons" size={20} color={Colors.lightGrey} />
                    <TextInput
                      placeholder='New Password'
                      secureTextEntry={!showPassword}
                      placeholderTextColor={Colors.lightGrey}
                      style={styles.text}
                      onChangeText={(password) => setPassword(password)}
                    />
                    <Icon name={showPassword ? 'visibility' : 'visibility-off'} type="material-icons" size={20} color={Colors.lightGrey} onPress={() => { setShowPassword(!showPassword); }} />
                  </View>

                  <View style={styles.textInputView}>
                    <Icon name="password" type="material-icons" size={20} color={Colors.lightGrey} />
                    <TextInput
                      placeholder='Confirm Password'
                      secureTextEntry={!showConfirmPassword}
                      placeholderTextColor={Colors.lightGrey}
                      style={styles.text}
                      onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                    />
                    <Icon name={showConfirmPassword ? 'visibility' : 'visibility-off'} type="material-icons" size={20} color={Colors.lightGrey} onPress={() => { setShowConfirmPassword(!showConfirmPassword); }} />
                  </View>
                </View>
                <View>
                  <TouchableOpacity style={styles.touchableOpacity} onPress={() => { resetPassword() }}>
                    <Text style={styles.buttonText}>Reset Password</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :
              null
            }

          </View>
        }
      </ScrollView>
    </KeyboardAvoidingView>

  );
}

ForgotPassword.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default ForgotPassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  headingView: {
    padding: 20,
    marginTop: 20
  },
  headingText: {
    fontSize: FontSize.xLarge,
    fontFamily: Fonts.semiBold,
    color: Colors.darkGrey,
  },
  centerView: {
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  text2: {
    fontFamily: Fonts.regular,
    color: Colors.lightGrey
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
  touchableOpacityBorder: {
    backgroundColor: Colors.white,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 50,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: FontSize.medium,
    fontFamily: Fonts.bold,
  },
  buttonTextBorder: {
    color: Colors.primary,
    textAlign: "center",
    fontSize: FontSize.medium,
    fontFamily: Fonts.bold,
  },
});