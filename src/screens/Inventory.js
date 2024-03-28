import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors, FontSize } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import PropTypes from 'prop-types';

const Inventory = ({ navigation }) => {


  return (
    <ScrollView style={styles.container}>

      <View>

        <TouchableOpacity onPress={() => { navigation.navigate("Store Inventory") }}>
          <View style={styles.card}>
            <Text style={styles.textContent1}>Store Inventory</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate("Staff Inventory") }}>
          <View style={styles.card}>
            <Text style={styles.textContent1}>Staff Inventory</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate("Return From Staff") }}>
          <View style={styles.card}>
            <Text style={styles.textContent1}>Return From Staff</Text>
          </View>
        </TouchableOpacity>

      </View>


    </ScrollView>
  )
}

Inventory.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Inventory

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
  textContent1: {
    color: Colors.primary,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: FontSize.medium,
  },
});