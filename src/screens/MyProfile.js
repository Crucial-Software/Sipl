import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Colors, FontSize } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import moment from 'moment';

const MyProfile = ({ navigation }) => {

  const [profileDetails, setProfileDetails] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {

    getData();

  }, []);

  const getData = async () => {

    await AsyncStorage.getItem('userEmpDetails')
      .then(stringifiedEmpDetails => {

        const parsedEmpDetails = JSON.parse(stringifiedEmpDetails);

        if (!parsedEmpDetails || typeof parsedEmpDetails !== 'object') return;

        setProfileDetails(parsedEmpDetails[0]);
        setUserId(parsedEmpDetails[0].users_id);
      })
      .catch(err => {
        console.warn('Error restoring Emp Details from async');
        console.warn(err);
      });

  };

  return (
    <ScrollView style={styles.container}>

      <View>

        <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <View style={styles.profileImageView}>
              <Image style={styles.profileImage} source={require('../assets/images/profile.png')} tintColor="#b5c0d6" />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.contentViewStyle}>
              <Text style={styles.textHeading}>App Id</Text>
              <Text style={styles.textContent}>{profileDetails.id}</Text>
              <View style={styles.viewStyle} />
            </View>
          </View>
        </View>

        <View style={styles.contentViewStyle}>
          <Text style={styles.textHeading}>Full Name</Text>
          <Text style={styles.textContent}>{profileDetails.empname}</Text>
          <View style={styles.viewStyle} />
        </View>

        <View style={styles.contentViewStyle}>
          <Text style={styles.textHeading}>Mobile</Text>
          <Text style={styles.textContent}>{profileDetails.contactno}</Text>
          <View style={styles.viewStyle} />
        </View>

        <View style={styles.contentViewStyle}>
          <Text style={styles.textHeading}>Date of Birth</Text>
          <Text style={styles.textContent}>{moment(profileDetails.dob).format("DD-MMM-YYYY")}</Text>
          <View style={styles.viewStyle} />
        </View>

        <View style={styles.contentViewStyle}>
          <Text style={styles.textHeading}>Employee Code</Text>
          <Text style={styles.textContent}>{profileDetails.empcode}</Text>
          <View style={styles.viewStyle} />
        </View>

        <View style={styles.contentViewStyle}>
          <Text style={styles.textHeading}>Designation</Text>
          <Text style={styles.textContent}>{profileDetails.designation}</Text>
          <View style={styles.viewStyle} />
        </View>

        <View style={styles.contentViewStyle}>
          <Text style={styles.textHeading}>Location</Text>
          <Text style={styles.textContent}>{profileDetails.locationname}</Text>
          <View style={styles.viewStyle} />
        </View>

        <TouchableOpacity onPress={() => { navigation.navigate("Change Password", { userid: userId,}) }}>
          <View style={styles.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.textContent1}>Change Password</Text>
              <Icon name='edit' type='material-icon' size={20} color={Colors.primary} />
            </View>
          </View>
        </TouchableOpacity>
      </View>


    </ScrollView>
  )
}

MyProfile.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default MyProfile

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: 10
  },
  profileImageView: {
    alignItems: "flex-start",
    margin: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
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
  textContent1: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: FontSize.medium,
  },
  viewStyle: {
    backgroundColor: Colors.grey,
    height: 2,
  },
  card: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    margin: 10,
    padding: 15
  }
});