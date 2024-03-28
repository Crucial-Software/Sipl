import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { Colors, FontSize, Fonts } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import PropTypes from 'prop-types';

const AddEmergencyInventory = ({ navigation }) => {


  return (
    <ScrollView style={styles.container}>

      <View>

        <View style={styles.contentViewStyle}>
          <Text style={styles.textHeading}>Name</Text>
          <TextInput style={styles.textContent} onChangeText={() => { }} />
          <View style={styles.viewStyle} />
        </View>

        <View style={styles.contentViewStyle}>
          <Text style={styles.textHeading}>Mobile</Text>
          <TextInput style={styles.textContent} onChangeText={() => { }} />
          <View style={styles.viewStyle} />
        </View>

        <View style={styles.contentViewStyle}>
          <Text style={styles.textHeading}>Quantity</Text>
          <TextInput style={styles.textContent} onChangeText={() => { }} />
          <View style={styles.viewStyle} />
        </View>

        <View style={styles.contentViewStyle}>
          <Text style={styles.textHeading}>Employee Code</Text>
          <TextInput style={styles.textContent} onChangeText={() => { }} />
          <View style={styles.viewStyle} />
        </View>

        <View style={styles.contentViewStyle}>
          <Text style={styles.textHeading}>Designation</Text>
          <TextInput style={styles.textContent} onChangeText={() => { }} />
          <View style={styles.viewStyle} />
        </View>

        <TouchableOpacity style={styles.touchableOpacity} onPress={() => { }}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  )
}

AddEmergencyInventory.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default AddEmergencyInventory

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: 10
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
    fontFamily: Fonts.bold,
  },
});