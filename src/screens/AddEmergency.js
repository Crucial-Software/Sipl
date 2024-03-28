import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Keyboard } from 'react-native'
import { Colors, FontSize } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { API_BASE } from '../setupProxy';

const AddEmergency = ({ navigation }) => {

  const [loading, setLoading] = useState(false);
  const [customerNumber, setCustomerNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [remarks, setRemarks] = useState("");
  const [staffId, setStaffId] = useState(null);
  const [locationId, setLocationId] = useState(null);

  useEffect(() => {

    getData();

  }, []);

  const getData = async () => {

    await AsyncStorage.getItem('userEmpDetails')
      .then(stringifiedEmpDetails => {

        const parsedEmpDetails = JSON.parse(stringifiedEmpDetails);

        if (!parsedEmpDetails || typeof parsedEmpDetails !== 'object') return;

        setStaffId(parsedEmpDetails[0].id);
        setLocationId(parsedEmpDetails[0].locations_id);
      })
      .catch(err => {
        console.warn('Error restoring Emp Details from async');
        console.warn(err);
      });

  };

  const [date, setDate] = useState(new Date());

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onDateChange,
      mode: 'date',
      is24Hour: true,
    });
  };



  const [time, setTime] = useState(new Date());

  const onTimeChange = (event, selectedTime) => {
      const currentTime = selectedTime;
      setTime(currentTime);
  };

  const showTimepicker = () => {
      DateTimePickerAndroid.open({
          value: time,
          onChange: onTimeChange,
          mode: 'time',
          is24Hour: true,
          display:"default",
      });
  }; 

  const handleAddEmergency = () => {

    if (Keyboard.isVisible) {
      Keyboard.dismiss();
    }

    let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;

    if (!customerNumber && !customerName && !customerPhone && !customerAddress && !remarks) {
      Snackbar.show({ text: 'Enter All Details', duration: Snackbar.LENGTH_SHORT });
    } else if (!customerNumber) {
      Snackbar.show({ text: 'Enter Customer Number', duration: Snackbar.LENGTH_SHORT });
    } else if (!customerName) {
      Snackbar.show({ text: 'Enter Customer Name', duration: Snackbar.LENGTH_SHORT });
    } else if (!customerPhone) {
      Snackbar.show({ text: 'Enter Customer Phone', duration: Snackbar.LENGTH_SHORT });
    } else if (!customerAddress) {
      Snackbar.show({ text: 'Enter Customer Address', duration: Snackbar.LENGTH_SHORT });
    } else if (!remarks) {
      Snackbar.show({ text: 'Enter Remarks', duration: Snackbar.LENGTH_SHORT });
    } else if (customerPhone.length != 10) {
      Snackbar.show({ text: 'Enter Customer Phone', duration: Snackbar.LENGTH_SHORT })
    } else if (format.test(customerPhone) || customerPhone.includes(" ") || customerPhone.includes(".") || customerPhone == "0" || customerPhone == "0.0" || customerPhone == "0.00") {
      Snackbar.show({ text: 'Enter a Valid Customer Phone', duration: Snackbar.LENGTH_SHORT })
    } 
    else {

      setLoading(true);

      console.log(
        " calltime: " + moment(date).format("YYYY-MM-DD") + " " + moment(time).format("HH:mm") + 
        " customerno: " + customerNumber +
        " customername: " + customerName +
        " customerphone: " + customerPhone +
        " address: " + customerAddress +
        " staffs_id: " + staffId +
        " locations_id: " + locationId +
        " remarks: " + remarks
      )

      let toInput = {
        calltime: moment(date).format("YYYY-MM-DD ")  + " " + moment(time).format("HH:mm"),
        customerno: customerNumber,
        customername: customerName,
        customerphone: customerPhone,
        address: customerAddress,
        staffs_id: staffId,
        locations_id: locationId,
        remarks: remarks
      };

      fetch(`${API_BASE}/app/work/createemergency`, {
        method: "POST",
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(toInput)
      })
        .then((response) => response.json())
        .then((response) => {

          setLoading(false);
          Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT })

          if (response.code === 1) {
            clearValues();
          }

        })
        .catch((error) => {
          setLoading(false);
          console.error('RETURN TO STORE There was an error!', error);
          Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
        })

    }
  }

  const clearValues = () => {
    
    setDate(new Date());
    setCustomerNumber("");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setRemarks("");
}

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps='handled' >

        {loading ?
          <ActivityIndicator />
          :
          <View>

            <View style={styles.contentViewStyle}>
              <Text style={styles.textHeading}>Date</Text>
              <View style={styles.contentSubViewStyleRow}>
                <View style={{ marginEnd: 10 }}>
                  <Icon name="calendar" type="font-awesome" size={20} color="#044F87" onPress={showDatepicker} />
                </View>
                <Text style={styles.textContent}>{moment(date).format("DD-MMM-YYYY")}</Text>
              </View>
              <View style={styles.viewStyle} />
            </View>

            <View style={styles.contentViewStyle}>
              <Text style={styles.textHeading}>Time</Text>
              <View style={styles.contentSubViewStyleRow}>
                <View style={{ marginEnd: 10 }}>
                  <Icon name="schedule" type="material-icon" size={20} color="#044F87" onPress={showTimepicker} />
                </View>
                <Text style={styles.textContent}>{moment(time).format("HH:mm")}</Text>
              </View>
              <View style={styles.viewStyle} />
            </View>

            <View style={styles.contentViewStyle}>
              <Text style={styles.textHeading}>Customer Number</Text>
              <TextInput style={styles.textContent} value={customerNumber} onChangeText={(text) => setCustomerNumber(text)} />
              <View style={styles.viewStyle} />
            </View>

            <View style={styles.contentViewStyle}>
              <Text style={styles.textHeading}>Customer Name</Text>
              <TextInput style={styles.textContent} value={customerName} onChangeText={(text) => setCustomerName(text)} />
              <View style={styles.viewStyle} />
            </View>

            <View style={styles.contentViewStyle}>
              <Text style={styles.textHeading}>Customer Phone</Text>
              <TextInput style={styles.textContent} value={customerPhone} onChangeText={(text) => setCustomerPhone(text)} keyboardType='phone-pad' maxLength={10} />
              <View style={styles.viewStyle} />
            </View>


            <View style={styles.contentViewStyle}>
              <Text style={styles.textHeading}>Customer Address</Text>
              <TextInput style={styles.textContent} value={customerAddress} onChangeText={(text) => setCustomerAddress(text)} />
              <View style={styles.viewStyle} />
            </View>

            <View style={styles.contentViewStyle}>
              <Text style={styles.textHeading}>Remarks</Text>
              <TextInput style={styles.textContent} value={remarks} onChangeText={(text) => setRemarks(text)} />
              <View style={styles.viewStyle} />
            </View>

            <TouchableOpacity style={styles.touchableOpacity} onPress={() => { handleAddEmergency() }}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>

          </View>
        }




      </ScrollView >

    </KeyboardAvoidingView>
  )
}

AddEmergency.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default AddEmergency

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: 10
  },
  contentSubViewStyleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentViewStyle: {
    margin: 10
  },
  textHeading: {
    color: Colors.lightGrey,
  },
  textContent: {
    color: Colors.black,
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: FontSize.medium,
  },
  viewStyle: {
    backgroundColor: Colors.grey,
    height: 2,
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
  },
});