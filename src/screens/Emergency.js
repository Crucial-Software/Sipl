import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors, FontSize } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import PropTypes from 'prop-types';

const Emergency = ({ navigation }) => {
  

  return (
    <ScrollView style={styles.container}>

      <View>

        <TouchableOpacity onPress={() => { navigation.navigate("Emergency Inventory")}}>
          <View style={styles.card}>
              <Text style={styles.textContent}>Emergency Inventory</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate("Add Emergency Inventory") }}>
          <View style={styles.card}>
              <Text style={styles.textContent}>Add Emergency Inventory</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate("Add Emergency") }}>
          <View style={styles.card}>
              <Text style={styles.textContent}>Add Emergency</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate("All Emergency") }}>
          <View style={styles.card}>
              <Text style={styles.textContent}>All Emergency</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate("View Emergency Photos") }}>
          <View style={styles.card}>
              <Text style={styles.textContent}>View Images</Text>
          </View>
        </TouchableOpacity>

      </View>


    </ScrollView>
  )
}

Emergency.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Emergency

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
  textContent: {
    color: Colors.primary,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: FontSize.medium,
  },
});