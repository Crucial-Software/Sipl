import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { Colors, FontSize, Fonts } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import { API_BASE } from '../setupProxy';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import NoDataFound from '../common/NoDataFound';
import AttendanceDetailsListItem from '../components/AttendanceDetailsListItem';

const AttendanceDetails = ({ navigation, route }) => {

  const { year, monthValue, month, total, present, currMonth } = route.params;

  const [loading, setLoading] = useState(true);
  const [attendanceDetailsList, setAttendanceDetailsList] = useState([]);
  const [staffName, setStaffName] = useState("");
  const [staffDept, setStaffDept] = useState("");
  const [staffDesg, setStaffDesg] = useState("");
  const [staffLoc, setStaffLoc] = useState("");

  useEffect(() => {

    setLoading(false);

    getData();

  }, []);

  const getData = async () => {

    await AsyncStorage.getItem('userEmpDetails')
      .then(stringifiedEmpDetails => {

        const parsedEmpDetails = JSON.parse(stringifiedEmpDetails);

        if (!parsedEmpDetails || typeof parsedEmpDetails !== 'object') return;

        if (parsedEmpDetails[0] !== null || parsedEmpDetails[0] !== "") {
          setStaffName(parsedEmpDetails[0].empname);
          setStaffDept(parsedEmpDetails[0].department);
          setStaffDesg(parsedEmpDetails[0].designation);
          setStaffLoc(parsedEmpDetails[0].locationname);
          getAttendanceDetails(parsedEmpDetails[0]);
        }

      })
      .catch(err => {
        console.warn('Error restoring Emp Details from async');
        console.warn(err);
      });

  };

  const getAttendanceDetails = async (data) => {

    setLoading(true);

    const startOfMonth = moment(`${year}-${monthValue}`).startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment(`${year}-${monthValue}`).endOf('month').format('YYYY-MM-DD');
    console.log("start : " + startOfMonth + " end: " + endOfMonth);

    let toInput = {
      staffs_id: data.id,
      fromdate: startOfMonth,
      todate: endOfMonth
    };

    console.log("ATTENDANCE DETAILS Input: " + JSON.stringify(toInput));

    await fetch(`${API_BASE}/app/attendance/myattendance`, {
      method: "POST",
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(toInput)
    })
      .then((response) => response.json())
      .then((response) => {

        console.log(JSON.stringify(response));

        setLoading(false);

        if (response.code === 1) {
          (response.model).sort((a, b) => new Date(a.fordate) > new Date(b.fordate) ? 1 : -1);
          setAttendanceDetailsList(response.model);
        } else {
          Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT })
        }

      })
      .catch((error) => {
        setLoading(false);
        console.error('ATTENDANCE DETAILS There was an error!', error);
        Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })

      })

  }

  const absent = parseFloat(total) - parseFloat(present);

  return (

    <ScrollView style={styles.container}>

      <View>

        <View style={{ paddingVertical: 20 }}>
          <Text style={styles.textHeading}>{staffName}</Text>
          <View>
            <Text style={styles.itemTextSubHeadingTotalHeading}>{staffDesg} - {staffDept}</Text>
            <Text style={styles.itemTextSubHeadingTotalHeading}>Location - {staffLoc}</Text>
          </View>
        </View>

        <View>

          <View style={styles.itemContentHeading}>
            <Text style={styles.itemTextHeading}>{month} - {year}</Text>
          </View>

          <View style={styles.itemSubContent}>
            <View>
              <Text style={styles.itemTextSubHeadingTotalHeading} >Total</Text>
              <Text style={styles.itemTextSubHeadingTotal} >{total} days</Text>
            </View>
            <View>
              <Text style={styles.itemTextSubHeadingPresentHeading} >Present</Text>
              <Text style={styles.itemTextSubHeadingPresent} >{present} days</Text>
            </View>
            <View>
              <Text style={styles.itemTextSubHeadingAbsentHeading} >Absent</Text>
              {month !== currMonth ? <Text style={styles.itemTextSubHeadingAbsent} >{absent} days</Text> : <Text style={styles.itemTextSubHeadingAbsent} >0 days</Text>}
            </View>
          </View>

        </View>

        {loading ?
          <ActivityIndicator />
          :
          <View>
            <View style={styles.itemContentHeading}>
              <Text style={styles.itemTextHeading} >Date</Text>
              <Text style={styles.itemTextHeading} >In Time</Text>
              <Text style={styles.itemTextHeading} >Out Time</Text>
              <Text style={styles.itemTextHeading} >Total hours</Text>
            </View>
            <ScrollView contentContainerStyle={{ width: '100%' }} horizontal={true}>
              <FlatList
                data={attendanceDetailsList}
                keyExtractor={(item, index) => { return index.toString(); }}
                renderItem={({ item, index }) => <AttendanceDetailsListItem item={item} index={index} navigation={navigation} />}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<NoDataFound />}
              />
            </ScrollView>
          </View>
        }

      </View>
    </ScrollView>

  )
}

AttendanceDetails.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default AttendanceDetails

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  textHeading: {
    fontWeight: "bold",
    color: Colors.black,
    fontSize: FontSize.mediumLarge,
    paddingHorizontal: 20,
    textAlign: "center"
  },
  itemContentHeading: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: Colors.lightGrey,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  itemTextHeading: {
    flex: 1,
    color: Colors.black,
    fontSize: FontSize.smallMedium,
    fontWeight: "bold"
  },
  itemSubContent: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  itemTextSubHeadingTotalHeading: {
    textAlign: "center",
    color: Colors.primary,
    fontFamily: Fonts.regular,
    fontSize: FontSize.smallMedium,
  },
  itemTextSubHeadingTotal: {
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.primary,
    fontFamily: Fonts.regular,
    fontSize: FontSize.smallMedium,
  },
  itemTextSubHeadingPresentHeading: {
    textAlign: "center",
    color: Colors.lightGreen,
    fontFamily: Fonts.regular,
    fontSize: FontSize.smallMedium,
  },
  itemTextSubHeadingPresent: {
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.lightGreen,
    fontFamily: Fonts.regular,
    fontSize: FontSize.smallMedium,
  },
  itemTextSubHeadingAbsentHeading: {
    textAlign: "center",
    color: Colors.red,
    fontFamily: Fonts.regular,
    fontSize: FontSize.smallMedium,
  },
  itemTextSubHeadingAbsent: {
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.red,
    fontFamily: Fonts.regular,
    fontSize: FontSize.smallMedium,
  },
});