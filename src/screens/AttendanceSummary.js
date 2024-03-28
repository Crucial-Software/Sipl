import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { Colors } from '../common/ConstantStyles';
import { API_BASE } from '../setupProxy';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import NoDataFound from '../common/NoDataFound';
import AttendanceSummaryListItem from '../components/AttendanceSummaryListItem';

const AttendanceSummary = ({ navigation }) => {

  const [loading, setLoading] = useState(false);
  const [attendanceSummaryList, setAttendanceSummaryList] = useState([]);

  useEffect(() => {

    getAttendanceSummary();

  }, []);

  const getAttendanceSummary = async () => {

    setLoading(true);

    try {

      const sId = await AsyncStorage.getItem('staffId');

      if (sId) {
        let toInput = {
          staffs_id: sId,
        };

        await fetch(`${API_BASE}/app/attendance/listbymonth`, {
          method: "POST",
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(toInput)
        })
          .then((response) => response.json())
          .then((response) => {

            if (response.code === 1) {
              setLoading(false);
              setAttendanceSummaryList(response.model);
            } else {
              setLoading(false);
              Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT })
            }

          })
          .catch((error) => {
            setLoading(false);
            console.error('ATTENDANCE SUMMARY There was an error!', error);
            Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
          })
      }
    } catch (e) {
      console.log("Not able to fetch sId");
    }


  }

  return (
    <View style={styles.container}>

      {loading ?
        <ActivityIndicator />
        :
        <FlatList
          data={attendanceSummaryList}
          keyExtractor={(item, index) => { return index.toString(); }}
          renderItem={({ item, index }) => <AttendanceSummaryListItem item={item} index={index} navigation={navigation} />}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<NoDataFound />}
        />
      }

    </View>
  )
}

AttendanceSummary.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default AttendanceSummary

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },


});