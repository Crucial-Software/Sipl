import React, { useEffect, useCallback, useState } from 'react'
import { Text, View, PermissionsAndroid, StyleSheet, Dimensions, Alert, BackHandler, TouchableOpacity, SafeAreaView, TouchableHighlight, Platform, ActivityIndicator, Button } from 'react-native'
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraScreen } from 'react-native-camera-kit';
import { Colors, FontSize, Fonts } from '../common/ConstantStyles';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { API_BASE } from '../setupProxy';
import moment from 'moment';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';

const Dashboard = ({ navigation }) => {

  const [opneScanner, setOpneScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [empDetails, setEmpDetails] = useState([]);
  const [userToken, setUserToken] = useState("");
  const [userLastIn, setUserLastIn] = useState("");
  const [userLastOut, setUserLastOut] = useState("");

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setOpneScanner(false);
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

  useEffect(() => {
    getAllPermissions();
    getData();

  }, []);

  const getData = async () => {

    const firebaseUserToken = await AsyncStorage.getItem("firebaseUserToken");

    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      setUserToken(token);
    }

    let lastInTime = await AsyncStorage.getItem('userLastIn');
    let lastOutTime = await AsyncStorage.getItem('userLastOut');

    console.log("FROM LOGIN API lastin: " + lastInTime + " lastout: " + lastOutTime);

    await AsyncStorage.getItem('userEmpDetails')
      .then(stringifiedEmpDetails => {
        console.log('Restored Emp Details Dashboard:');
        console.log(stringifiedEmpDetails);

        const parsedEmpDetails = JSON.parse(stringifiedEmpDetails);

        if (!parsedEmpDetails || typeof parsedEmpDetails !== 'object') return;

        setEmpDetails(parsedEmpDetails[0]);

        if (firebaseUserToken) {
          console.log("" + parsedEmpDetails[0].id + " " + firebaseUserToken);
          updateToken(parsedEmpDetails[0].id, firebaseUserToken);
        }
        // else {
        //   if (lastInTime) {
        //     setUserLastIn(lastInTime);
        //   }
        //   if (lastOutTime) {
        //     setUserLastOut(lastOutTime);
        //   }
        // }

      })
      .catch(err => {
        console.warn('Error restoring Emp Details from async');
        console.warn(err);
      });

  };

  const updateToken = async (staffId, fToken) => {

    let toInput = {
      staffs_id: staffId,
      token: fToken
    };

    await fetch(`${API_BASE}/app/token/updatetoken`, {
      method: "POST",
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(toInput)
    })
      .then((response) => response.json())
      .then((response) => {

        console.log("res: " + JSON.stringify(response));

        if (response.code == 1) {
          console.log("Inside if");
          setUserLastIn(response.lastin);
          setUserLastOut(response.lastout);
        } else {
          console.log("Inside else");
          setUserLastIn("N/A");
          setUserLastOut("N/A");
        }

      })
      .catch((error) => {
        setLoading(false);
        console.error('STAFF INVENTORY There was an error!', error);
        Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
      })

  }

  const getAllPermissions = async () => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ]).then(result => {
      if (
        result['android.permission.CAMERA'] &&
        result['android.permission.CALL_PHONE'] &&
        result['android.permission.WRITE_EXTERNAL_STORAGE'] &&
        result['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
      ) {
        //Snackbar.show({ text: 'All permissions granted!', duration: Snackbar.LENGTH_SHORT })
      } else {
        Snackbar.show({ text: 'Permissions denied! You need to give permissions.', duration: Snackbar.LENGTH_SHORT })
      }
    });
  }

  const onOpenScanner = () => {
    // To Start Scanning
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs permission for camera access',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setOpneScanner(true);
          } else {
            Snackbar.show({ text: 'CAMERA permission denied', duration: Snackbar.LENGTH_SHORT });
          }
        } catch (err) {
          Snackbar.show({ text: 'Camera Permission Error ' + err, duration: Snackbar.LENGTH_SHORT })
          console.warn("cam per error: " + err);
        }
      }
      // Calling the camera permission function
      requestCameraPermission();
    } else {
      setOpneScanner(true);
    }
  }

  const onBarcodeScan = async (qrvalue) => {
    // Called after the successful scanning of QRCode/Barcode
    setOpneScanner(false);

    // Alert.alert(
    //   'Check QR', ''+qrvalue,
    //   [
    //     { text: 'OK', onPress: () => console.log('Cancel Pressed. App Not Exit'), style: 'cancel', },
    //   ], {
    //   cancelable: false,
    // },
    // );

    const qrValueString = qrvalue.split('|');
    const locId = qrValueString[0];
    const inOrOut = qrValueString[1];

    if(locId && inOrOut){
      console.log("Got the split values");
    } else{
      console.log("Proper Split values not found");
    }

    let currentDate = moment(new Date()).format("YYYY-MM-DD")
    let currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    console.log("date: " + currentDate + "time: " + currentTime + "locId: " + locId + " inOrOut: " + inOrOut);

    setIsLoading(true);

    createAttendance(currentDate, currentTime, locId, inOrOut);

  };

  const createAttendance = (currentDate, currentTime, locId, inOrOut) => {

    let toInput;

    if (inOrOut === "IN") {
      toInput = {
        token: userToken,
        locations_id: locId,
        companies_id: empDetails.companies_id,
        staffs_id: empDetails.id,
        fordate: currentDate,
        intime: currentTime,
        ga: empDetails.ga,
        remarks: 'By App'
      };
    } else if (inOrOut === "OUT") {
      toInput = {
        token: userToken,
        locations_id: locId,
        companies_id: empDetails.companies_id,
        staffs_id: empDetails.id,
        fordate: currentDate,
        outtime: currentTime,
        ga: empDetails.ga,
        remarks: 'By App'
      };
    }

    console.log(JSON.stringify(toInput));

    fetch(`${API_BASE}/app/attendance`, {
      method: "POST",
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(toInput)
    })
      .then((response) => response.json())
      .then((response) => {

        console.log(JSON.stringify(response));

        if (response.code === 1) {
          setIsLoading(false);
          Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT });
          if (response.val.intime === null) {
            setUserLastIn("N/A");
          } else {
            setUserLastIn(response.val.intime);
          }
          if (response.val.outtime === null) {
            setUserLastOut("N/A");
          } else {
            setUserLastOut(response.val.outtime);
          }

        } else {
          Snackbar.show({ text: '' + response.message + " - QR Error", duration: Snackbar.LENGTH_SHORT });
          setIsLoading(false);
        }

      })
      .catch((error) => {
        console.error('DASHBOARD ATTENDANCE ERROR There was an error!', error);
        Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })

      })

  }

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={{ backgroundColor: 'white' }}>
        {isLoading ? <ActivityIndicator /> : null}
      </View>

      {opneScanner ?
        (
          <View style={{ flex: 1 }}>
            <CameraScreen
              showFrame={true}
              scanBarcode={true}
              laserColor={'white'}
              frameColor={'white'}
              colorForScannerFrame={'white'}
              onReadCode={(event) => onBarcodeScan(event.nativeEvent.codeStringValue)
              }
            />
          </View>
        )
        :
        (
          <ScrollView style={styles.container}>

            <View>

              <View style={styles.viewStyle}>

                <View>
                  <TouchableHighlight onPress={onOpenScanner} style={styles.touchableOpacityGreen}>
                    <Text style={styles.buttonText}>Check In</Text>
                  </TouchableHighlight>
                  {userLastIn === "N/A" ? <Text style={styles.text1}>N/A</Text> : <Text style={styles.text1}>{moment(userLastIn).format("DD-MMM-YYYY HH:mm:ss")}</Text>}
                </View>

                <View>
                  <TouchableHighlight onPress={onOpenScanner} style={styles.touchableOpacityRed}>
                    <Text style={styles.buttonText}>Check Out</Text>
                  </TouchableHighlight>
                  {userLastOut === "N/A" ? <Text style={styles.text1}>N/A</Text> : <Text style={styles.text1}>{moment(userLastOut).format("DD-MMM-YYYY HH:mm:ss")}</Text>}
                </View>

              </View>

              <View style={styles.viewStyle}>

                <TouchableOpacity onPress={() => { navigation.navigate("My Profile") }} style={styles.itemContainer}>
                  <View style={styles.itemContent}>
                    <Icon name="person" type="material-icons" size={30} color={Colors.primary} />
                    <Text style={styles.itemTextHeading} >My Profile</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { navigation.navigate("Salary Slip") }} style={styles.itemContainer}>
                  <View style={styles.itemContent}>
                    <Icon name="request-quote" type="material-icons" size={30} color={Colors.primary} />
                    <Text style={styles.itemTextHeading} >Salary Slip</Text>
                  </View>
                </TouchableOpacity>

              </View>

              <View style={styles.viewStyle}>

                <TouchableOpacity onPress={() => { navigation.navigate("Work") }} style={styles.itemContainer}>
                  <View style={styles.itemContent}>
                    <Icon name="work" type="material-icons" size={30} color={Colors.primary} />
                    <Text style={styles.itemTextHeading} >Work</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { navigation.navigate("Attendance") }} style={styles.itemContainer}>
                  <View style={styles.itemContent}>
                    <Icon name="task" type="material-icons" size={30} color={Colors.primary} />
                    <Text style={styles.itemTextHeading} >My Attendance</Text>
                  </View>
                </TouchableOpacity>

              </View>

              <View style={styles.viewStyle}>

                <TouchableOpacity onPress={() => { navigation.navigate("Inventory") }} style={styles.itemContainer}>
                  <View style={styles.itemContent}>
                    <Icon name="inventory" type="material-icons" size={30} color={Colors.primary} />
                    <Text style={styles.itemTextHeading}>Inventory</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { navigation.navigate("Emergency") }} style={styles.itemContainer}>
                  <View style={styles.itemContent}>
                    <Icon name="tungsten" type="material-icons" size={30} color={Colors.primary} style={{ transform: 'rotate(180deg)' }} />
                    <Text style={styles.itemTextHeading}>Emergency</Text>
                  </View>
                </TouchableOpacity>

              </View>

              <View style={styles.viewStyle}>

                <TouchableOpacity onPress={() => { navigation.navigate("Issue Material") }} style={styles.itemContainer}>
                  <View style={styles.itemContent}>
                    <Icon name="shelves" type="material-icons" size={30} color={Colors.primary} />
                    <Text style={styles.itemTextHeading}>Issue Material</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { }} style={styles.itemContainer1}>
                  <View style={styles.itemContent}>

                  </View>
                </TouchableOpacity>

              </View>

            </View>
          </ScrollView>

        )
      }
    </SafeAreaView>

  )
}

Dashboard.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Dashboard

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  viewStyle: {
    flexDirection: "row",
    justifyContent: "center"
  },
  itemContainer: {
    width: Dimensions.get('window').width / 2.25,
    borderRadius: 5,
    shadowColor: Colors.darkGrey,
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    elevation: 5,
    margin: 10,
    borderWidth: 0.5,
    justifyContent: 'center', //Centered vertically
    alignItems: 'center', // Centered horizontally
  },
  itemContainer1: {
    width: Dimensions.get('window').width / 2.25,
    margin: 10,
    justifyContent: 'center', //Centered vertically
    alignItems: 'center', // Centered horizontally
  },
  itemContent: {
    padding: 20,
  },
  itemTextHeading: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
    fontSize: FontSize.medium,
  },
  touchableOpacityGreen: {
    width: 125,
    backgroundColor: Colors.lightGreen,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 50,
    padding: 12,
  },
  touchableOpacityRed: {
    width: 125,
    backgroundColor: Colors.red,
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
  text1: {
    color: Colors.primary,
    textAlign: "center",
    fontSize: FontSize.smallMedium,
    fontFamily: Fonts.semiBold,
  },

});