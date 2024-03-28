import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { Colors } from '../common/ConstantStyles';
import { API_BASE } from '../setupProxy';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import NoDataFound from '../common/NoDataFound';
import NotificationsListItem from '../components/NotificationsListItem';

const Data = [
    { title: "Notification Heading 1", content: "Notification Content1", date: "2024-02-21" },
    { title: "Notification Heading 2", content: "Notification Content2", date: "2024-02-20" },
    { title: "Notification Heading 3", content: "Notification Content3", date: "2024-02-19" },
    { title: "Notification Heading 4", content: "Notification Content4", date: "2024-02-18" },
    { title: "Notification Heading 5", content: "Notification Content5", date: "2024-02-17" },
    { title: "Notification Heading 6", content: "Notification Content6", date: "2024-02-21" },
    { title: "Notification Heading 7", content: "Notification Content7", date: "2024-02-20" },
    { title: "Notification Heading 8", content: "Notification Content8", date: "2024-02-19" },
    { title: "Notification Heading 9", content: "Notification Content9", date: "2024-02-18" },
    { title: "Notification Heading 10", content: "Notification Content10", date: "2024-02-17" },
]

const Notifications = ({ navigation }) => {

    const [loading, setLoading] = useState(false);
    const [notificationsList, setNotificationsList] = useState([]);

    useEffect(() => {

        setNotificationsList(Data);

        //getNotifications();

    }, []);

    

    const getNotifications = async () => {

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
                        setLoading(false);
                        if (response.code === 1) {
                            setNotificationsList(response.model);
                        } else {
                            Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT })
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        console.error('Notifications There was an error!', error);
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