import React, { useLayoutEffect, useState, useContext } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Image, Keyboard, ActivityIndicator, Linking, PermissionsAndroid, BackHandler, Alert } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { Colors, Fonts, FontSize } from '../common/ConstantStyles';
import { Icon } from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import { AuthContext } from '../navigation/AuthProvider';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE } from '../setupProxy';
import PropTypes from 'prop-types';

const Login = ({ navigation }) => {

  const { authlogin } = useContext(AuthContext);

  const [mobileEmail, setMobileEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit SIPL', 'Are you sure you want to exit this app?',
          [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed. App Not Exit'), style: 'cancel', },
            { text: 'OK', onPress: () => BackHandler.exitApp(), },
          ], {
          cancelable: false,
        },
        );
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: "" })
  }, []);

  const login = () => {

    console.log("mobileEmail: " + mobileEmail + " password: " + password);

    if (Keyboard.isVisible) {
      Keyboard.dismiss();
    }
    setIsLoading(true);

    if (!mobileEmail && !password) {
      setIsLoading(false);
      Snackbar.show({ text: 'Please enter details', duration: Snackbar.LENGTH_SHORT })
    }
    else if (!mobileEmail) {
      setIsLoading(false);
      Snackbar.show({ text: 'Please enter mobile number or email id', duration: Snackbar.LENGTH_SHORT })
    }
    else if (!password) {
      setIsLoading(false);
      Snackbar.show({ text: 'Please enter password', duration: Snackbar.LENGTH_SHORT })
    }
    else if (password.length < 6) {
      setIsLoading(false);
      Snackbar.show({ text: 'Please enter 6 character password', duration: Snackbar.LENGTH_SHORT })
    } else {

      setIsLoading(false);

      let toInput = {
        email: mobileEmail,
        password: password
      };

      fetch(`${API_BASE}/app/login`, {
        method: "POST",
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(toInput)
      })
        .then((response) => response.json())
        .then((response) => {

          console.log("LOGIN RESPONSE: " + JSON.stringify(response));

          if (response.code === 1) {
            setIsLoading(false);
            Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT })
            console.log("token: " + response.data.token);
            console.log("userid: " + response.data.user.id);
            console.log("username: " + response.data.user.name);
            console.log("useremail: " + response.data.user.email);
            console.log("useraccess: " + JSON.stringify(response.data.access));
            authlogin(response.data.token, 
              response.data.user.id, 
              response.data.user.name, 
              response.data.user.email, 
              response.data.emp, 
              response.data.lastin, 
              response.data.lastout,
              response.data.access
            );
          } else {
            setIsLoading(false);
            Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT })
          }

        })
        .catch((error) => {
          setIsLoading(false);
          console.error('LOGINSCREEN There was an error!', error);
          Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })

        })

    }

  }

  const contactAdmin = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        {
          title: 'SIPL Call Permission',
          message: 'SIPL wants your permission to make calls.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Linking.openURL('tel:8469922322');
      } else {
        console.log('Permission Denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }


  return (
    <KeyboardAvoidingView style={styles.container}>

      <ScrollView keyboardShouldPersistTaps='handled'>

        <View>

          <View style={styles.imagecenter}>
            <Image style={styles.applogo} source={require('../assets/images/sipl_logo-transparantbg.png')} />
          </View>

          <View>

            <View style={styles.headingView}>
              <Text style={styles.headingText}>Login</Text>
              {isLoading ? <ActivityIndicator /> : null}
            </View>

            <View style={styles.textInputView}>
              <Icon name="person" type="material-icons" size={20} color={Colors.lightGrey} />
              <TextInput
                placeholder='Mobile'
                placeholderTextColor={Colors.lightGrey}
                style={styles.text}
                keyboardType='phone-pad'
                maxLength={10}
                onChangeText={(mobileEmail) => setMobileEmail(mobileEmail)}
              />
            </View>

            <View style={styles.textInputView}>
              <Icon name="password" type="material-icons" size={20} color={Colors.lightGrey} />
              <TextInput
                placeholder='Password'
                secureTextEntry={!showPassword}
                placeholderTextColor={Colors.lightGrey}
                style={styles.text}
                onChangeText={(password) => setPassword(password)}
              />
              <Icon name={showPassword ? 'visibility' : 'visibility-off'} type="material-icons" size={20} color={Colors.lightGrey} onPress={() => { setShowPassword(!showPassword); }} />
            </View>

            <View style={styles.viewSide}>
              <TouchableOpacity onPress={() => { navigation.navigate("Forgot Password") }}>
                <View style={styles.textRow}>
                  <Text style={styles.text1}>Forgot Password?</Text>
                  <Icon name="trending-flat" type="material-icons" size={20} color={Colors.lightGrey} />
                </View>
              </TouchableOpacity>
            </View>

          </View>

          <View>

            <TouchableOpacity style={styles.touchableOpacity} onPress={() => { login() }}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.centerView}>
              <TouchableOpacity style={styles.touchableOpacity2} onPress={() => { contactAdmin() }}>
                <Text style={styles.buttonText2}>Contact Admin</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

Login.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  imagecenter: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  applogo: {
    width: 200,
    height: 150,
  },
  headingView: {
    padding: 20,
    alignItems: "center"
  },
  headingText: {
    fontSize: FontSize.xLarge,
    fontFamily: Fonts.semiBold,
    color: Colors.darkGrey,
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
  viewSide: {
    marginVertical: 10,
    marginHorizontal: 20
  },
  textRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end"
  },
  text1: {
    fontFamily: Fonts.semiBold,
    alignSelf: "flex-end",
    marginHorizontal: 5,
    color: Colors.lightGrey
  },
  touchableOpacity: {
    backgroundColor: Colors.primary,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 50,
    padding: 12,
  },
  buttonText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: FontSize.medium,
    fontFamily: Fonts.bold,
  },
  centerView: {
    marginVertical: 10,
    marginHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  touchableOpacity2: {
    backgroundColor: Colors.white,
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingTop: 4,
    paddingBottom: 6,
    borderWidth: 1,
    borderColor: Colors.primary
  },
  buttonText2: {
    color: Colors.primary,
    textAlign: "center",
    fontSize: FontSize.medium,
    fontFamily: Fonts.bold,
  },

});