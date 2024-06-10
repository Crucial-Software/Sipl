import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { Colors } from '../common/ConstantStyles';
import { API_BASE } from '../setupProxy';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import NoDataFound from '../common/NoDataFound';
import NotificationsListItem from '../components/NotificationsListItem';

const Notifications = ({ navigation }) => {

    const [loading, setLoading] = useState(false);
    const [notificationsList, setNotificationsList] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {

        await AsyncStorage.getItem('userEmpDetails')
            .then(stringifiedEmpDetails => {
                const parsedEmpDetails = JSON.parse(stringifiedEmpDetails);
                if (!parsedEmpDetails || typeof parsedEmpDetails !== 'object') return;
                getNotifications(parsedEmpDetails[0].locations_id, parsedEmpDetails[0].id);
            })
            .catch(err => {
                console.warn('Error restoring Emp Details from async');
                console.warn(err);
            });

    };

    const getNotifications = async (locid, staffid) => {

        setLoading(true);

        let toInput = {
            staffs_id: staffid,
            locations_id: locid,
        };

        await fetch(`${API_BASE}/app/notification/notificationlist`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        })
            .then((response) => response.json())
            .then((response) => {
                setLoading(false);
                if (response.list) {
                    setNotificationsList(response.list);
                } else {
                    Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT })
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error('Notifications There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again.' + error, duration: Snackbar.LENGTH_SHORT })
            })

    }

    return (
        <View style={styles.container}>

            {loading ?
                <ActivityIndicator />
                :
                <FlatList
                    data={notificationsList}
                    keyExtractor={(item, index) => { return index.toString(); }}
                    renderItem={({ item, index }) => <NotificationsListItem item={item} index={index} navigation={navigation} />}
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={<NoDataFound />}
                />
            }

        </View>

    )
}

Notifications.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default Notifications

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
    },
});