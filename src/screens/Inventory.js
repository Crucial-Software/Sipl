import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors, FontSize } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Inventory = ({ navigation }) => {

  const [userAccess, setUserAccess] = useState([]);

  useEffect(() => {

    getData();

  }, []);

  const getData = async () => {

    await AsyncStorage.getItem('userAccess')
      .then(stringifiedUserAccess => {
        const parsedUserAccessDetails = JSON.parse(stringifiedUserAccess);
        if (!parsedUserAccessDetails || typeof parsedUserAccessDetails !== 'object') return;
        setUserAccess(parsedUserAccessDetails);
      })
      .catch(err => {
        console.warn('Error restoring User Access Details from async');
        console.warn(err);
      });

  }


  return (
    <ScrollView style={styles.container}>

      <View>

        {userAccess.storeinventory ?
          <TouchableOpacity onPress={() => { navigation.navigate("Store Inventory") }}>
            <View style={styles.card}>
              <Text style={styles.textContent1}>Store Inventory</Text>
            </View>
          </TouchableOpacity>
          : null
        }

        {userAccess.staffinventory ?
          <TouchableOpacity onPress={() => { navigation.navigate("Staff Inventory") }}>
            <View style={styles.card}>
              <Text style={styles.textContent1}>My Materials</Text>
            </View>
          </TouchableOpacity>
          : null
        }

        {userAccess.returnfromstaff ?
          <TouchableOpacity onPress={() => { navigation.navigate("Return From Staff") }}>
            <View style={styles.card}>
              <Text style={styles.textContent1}>Return From Staff</Text>
            </View>
          </TouchableOpacity>
          : null
        }

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