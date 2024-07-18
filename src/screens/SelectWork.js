import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors, FontSize } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SelectWork = ({ navigation }) => {

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

        {userAccess.myconnection ?
          <TouchableOpacity onPress={() => { navigation.navigate("Tracker") }}>
            <View style={styles.card}>
              <Text style={styles.textContent1}>My Connection</Text>
            </View>
          </TouchableOpacity>
          : null
        }
        {userAccess.mydprs ?
          <TouchableOpacity onPress={() => { navigation.navigate("DPR") }}>
            <View style={styles.card}>
              <Text style={styles.textContent1}>My DPR</Text>
            </View>
          </TouchableOpacity>
          : null
        }
        {userAccess.mycomplain ?
          <TouchableOpacity onPress={() => { navigation.navigate("My Complain") }}>
            <View style={styles.card}>
              <Text style={styles.textContent1}>My Complain</Text>
            </View>
          </TouchableOpacity>
          : null
        }
        {userAccess.myamc ?
          <TouchableOpacity onPress={() => { navigation.navigate("My AMC") }}>
            <View style={styles.card}>
              <Text style={styles.textContent1}>My AMC</Text>
            </View>
          </TouchableOpacity>
          : null
        }
        {userAccess.allconnection ?
          <TouchableOpacity onPress={() => { navigation.navigate("All Tracker") }}>
            <View style={styles.card1}>
              <Text style={styles.textContent1}>All Connection</Text>
            </View>
          </TouchableOpacity>
          : null
        }
        {userAccess.alldprs ?
          <TouchableOpacity onPress={() => { navigation.navigate("All DPR") }}>
            <View style={styles.card1}>
              <Text style={styles.textContent1}>All DPR</Text>
            </View>
          </TouchableOpacity>
          : null
        }
        {userAccess.allcomplain ?
          <TouchableOpacity onPress={() => { navigation.navigate("All Complain") }}>
            <View style={styles.card1}>
              <Text style={styles.textContent1}>All Complain</Text>
            </View>
          </TouchableOpacity>
          : null
        }
        {userAccess.allamc ?
          <TouchableOpacity onPress={() => { navigation.navigate("All AMC") }}>
            <View style={styles.card1}>
              <Text style={styles.textContent1}>All AMC</Text>
            </View>
          </TouchableOpacity>
          : null
        }

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