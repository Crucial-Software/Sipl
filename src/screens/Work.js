import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Colors, FontSize } from '../common/ConstantStyles';
import { API_BASE } from '../setupProxy';
import { SearchBar, Icon } from 'react-native-elements';
import moment from 'moment';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Snackbar from 'react-native-snackbar';
import PropTypes from 'prop-types';
import NoDataFound from '../common/NoDataFound';
import WorkTrackerListItem from '../components/WorkTrackerListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Work = ({ navigation }) => {

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [workList, setWorkList] = useState([]);
    const [filterWorkList, setFilterWorkList] = useState([]);
    const [staffsId, setStaffsId] = useState(null);

    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());


    useEffect(() => {

        getStaffId();

    }, []);

    const getStaffId = async () => {

        const sId = await AsyncStorage.getItem('staffId');
        if (sId) {
            getWork(sId);
            setStaffsId(sId);
        }

    }

    const getWork = async (staffId) => {

        setLoading(true);

        let toInput = {
            fromdate: moment(fromDate).format("YYYY-MM-DD"),
            todate: moment(toDate).format("YYYY-MM-DD"),
            staffs_id: staffId,
        };

        await fetch(`${API_BASE}/app/work/listtrackerstaff`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        })
            .then((response) => response.json())
            .then((response) => {

                if (response) {
                    setLoading(false);
                    setWorkList(response.model);
                    setFilterWorkList(response.model);
                    console.log(workList.length);
                } else {
                    setLoading(false);
                    Snackbar.show({ text: 'Unable to load data', duration: Snackbar.LENGTH_SHORT })
                }

            })
            .catch((error) => {
                setLoading(false);
                console.error('WORK There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
            })

    }

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = workList.filter(function (item) {
                const itemData = item.orderno ? item.orderno + " " + item.applicationno + " " + item.customername + " " + item.houseno + " " + item.street1 + " " + item.telephoneno : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilterWorkList(newData);
            setSearch(text);
        } else {
            setFilterWorkList(workList);
            setSearch(text);
        }
    };

    const onFromDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        if (selectedDate > toDate) {
            Snackbar.show({ text: 'From Date should be smaller than To Date', duration: Snackbar.LENGTH_SHORT })
            setFromDate(new Date());
        } else {
            setFromDate(currentDate);
        }

    };

    const showFromDatepicker = () => {
        DateTimePickerAndroid.open({
            value: fromDate,
            onChange: onFromDateChange,
            mode: 'date',
            is24Hour: true,
            maximumDate: (new Date())
        });
    };

    const onToDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        if (selectedDate < fromDate) {
            Snackbar.show({ text: 'To Date should be greater than From Date', duration: Snackbar.LENGTH_SHORT })
            setToDate(new Date());
        } else {
            setToDate(currentDate);
        }

    };

    const showToDatepicker = () => {
        DateTimePickerAndroid.open({
            value: toDate,
            onChange: onToDateChange,
            mode: 'date',
            is24Hour: true,
            maximumDate: (new Date())
        });
    };

    const searchByDate = () => {

        console.log("MyTracker FromDate: " + moment(fromDate).format("DD-MMM-YYYY") + " ToDate: " + moment(toDate).format("DD-MMM-YYYY"));

        getWork(staffsId);

    }

    return (
        <View style={styles.container}>

            {loading ?
                <ActivityIndicator />
                :

                <View style={{ flex: 1 }}>

                    <SearchBar
                        round
                        lightTheme
                        searchIcon={{ size: 24 }}
                        onChangeText={(text) => searchFilterFunction(text)}
                        onClear={(text) => searchFilterFunction('')}
                        placeholder="Search Here..."
                        value={search}
                    />

                    <View style={styles.contentViewStyleRow}>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>From Date</Text>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Icon name="calendar" type="font-awesome" size={20} color="#044F87" onPress={showFromDatepicker} />
                                <Text style={styles.textContent}>{moment(fromDate).format("DD-MMM-YYYY")}</Text>
                            </View>
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>To Date</Text>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Icon name="calendar" type="font-awesome" size={20} color="#044F87" onPress={showToDatepicker} />
                                <Text style={styles.textContent}>{moment(toDate).format("DD-MMM-YYYY")}</Text>
                            </View>
                            <View style={styles.viewStyle} />
                        </View>

                        <TouchableOpacity onPress={() => { searchByDate(); }} style={{ marginTop: 10, marginStart: 5, alignSelf: "center", }}>
                            <View style={{ backgroundColor: Colors.primary, padding: 10, borderWidth: 1, borderRadius: 5, }}>
                                <Icon name="search" type="font-awesome" size={20} color="#fff" />
                            </View>
                        </TouchableOpacity>

                    </View>

                    <FlatList
                        data={filterWorkList}
                        keyExtractor={(item, index) => { return index.toString(); }}
                        renderItem={({ item, index }) => {
                            return (
                                <WorkTrackerListItem
                                    item={item}
                                    index={index}
                                    navigation={navigation}
                                    staffId={staffsId}
                                    functionGetWork={() => { getWork(staffsId); }} />
                            );
                        }}
                        keyboardShouldPersistTaps="handled"
                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={<NoDataFound />}
                    />
                </View>
            }

        </View>
    )
}

Work.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default Work

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    contentViewStyleRow: {
        flexDirection: "row",
        padding: 5
    },
    contentViewStyle: {
        margin: 5,
        flex: 1
    },
    textHeading: {
        color: Colors.primary,
    },
    viewStyle: {
        backgroundColor: Colors.grey,
        height: 2,
    },
    textContent: {
        color: Colors.black,
        paddingTop: 10,
        paddingBottom: 5,
        marginStart: 10,
        fontSize: FontSize.smallMedium,
    },
});