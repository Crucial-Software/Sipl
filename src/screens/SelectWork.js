import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors, FontSize } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import PropTypes from 'prop-types';

const SelectWork = ({ navigation }) => {

  return (
    <ScrollView style={styles.container}>

      <View>

        <TouchableOpacity onPress={() => { navigation.navigate("Tracker") }}>
          <View style={styles.card}>
            <Text style={styles.textContent1}>My Connection</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate("DPR") }}>
          <View style={styles.card}>
            <Text style={styles.textContent1}>My DPR</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate("My Complain") }}>
          <View style={styles.card}>
            <Text style={styles.textContent1}>My Complain</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate("My AMC") }}>
          <View style={styles.card}>
            <Text style={styles.textContent1}>My AMC</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate("All Tracker") }}>
          <View style={styles.card1}>
            <Text style={styles.textContent1}>All Connection</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate("All DPR") }}>
          <View style={styles.card1}>
            <Text style={styles.textContent1}>All DPR</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate("All Complain") }}>
          <View style={styles.card1}>
            <Text style={styles.textContent1}>All Complain</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate("All AMC") }}>
          <View style={styles.card1}>
            <Text style={styles.textContent1}>All AMC</Text>
          </View>
        </TouchableOpacity>

      </View>

    </ScrollView>
  )
}

SelectWork.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default SelectWork

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: 10
  },
  card: {
    backgroundColor: Colors.primaryLight2,
    borderWidth: 1,
    borderColor: Colors.primary,
    margin: 10,
    padding: 15
  },
  card1: {
    backgroundColor: Colors.primaryLight1,
    borderWidth: 1,
    borderColor: Colors.primary,
    margin: 10,
    padding: 15
  },
  textContent1: {
    color: Colors.primary,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: FontSize.medium,
  },
});