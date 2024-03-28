import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions, TouchableHighlight, Modal, TouchableOpacity, TextInput, Keyboard, KeyboardAvoidingView } from 'react-native'
import { Colors, FontSize, Fonts } from '../common/ConstantStyles';
import { API_BASE } from '../setupProxy';
import Snackbar from 'react-native-snackbar';
import PropTypes from 'prop-types';
import NoDataFound from '../common/NoDataFound';
import AllEmergencyListItem from '../components/AllEmergencyListItem';
import { SearchBar, Icon } from 'react-native-elements';
import { MultiSelect } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';

const AllEmergency = ({ navigation }) => {

    const [loading, setLoading] = useState(false);
    const [workList, setWorkList] = useState([]);
    const [filterWorkList, setFilterWorkList] = useState([]);
    const [staffList, setStaffList] = useState([]);

    const [staffFocus, setStaffFocus] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState([]);

    const [locationId, setLocationId] = useState(null);
    const [byStaffId, setByStaffId] = useState(null);
    const [remarks, setRemarks] = useState("");

    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState('');

    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());

    const [selectedWorkIds, setSelectedWorkIds] = useState("");

    useEffect(() => {

        getData();

    }, []);

    const getWork = async (locid) => {

        setLoading(true);

        console.log("fdate: " + moment(fromDate).format("YYYY-MM-DD") + " todate: " + moment(toDate).format("YYYY-MM-DD"));

        let toInput = {
            fromdate: moment(fromDate).format("YYYY-MM-DD"),
            todate: moment(toDate).format("YYYY-MM-DD"),
            locations_id: locid
        };
        console.log(JSON.stringify(toInput));

        await fetch(`${API_BASE}/app/work/listemergency`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        })
            .then((response) => response.json())
            .then((response) => {

                if (response) {
                    response.model.map(item => {
                        item.isSelected = false;
                    })
                    setLoading(false);
                    setWorkList(response.model);
                    setFilterWorkList(response.model);
                } else {
                    setLoading(false);
                    Snackbar.show({ text: 'Unable to load data', duration: Snackbar.LENGTH_SHORT })
                }

            })
            .catch((error) => {
                setLoading(false);
                console.error('WORK EMERGENCY There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
            })

    }

    const getData = async () => {

        await AsyncStorage.getItem('userEmpDetails')
            .then(stringifiedEmpDetails => {

                const parsedEmpDetails = JSON.parse(stringifiedEmpDetails);

                if (!parsedEmpDetails || typeof parsedEmpDetails !== 'object') return;

                setByStaffId(parsedEmpDetails[0].id);
                setLocationId(parsedEmpDetails[0].locations_id);
                getStaffsByLocationList(parsedEmpDetails[0].locations_id);
                getWork(parsedEmpDetails[0].locations_id);
            })
            .catch(err => {
                console.warn('Error restoring Emp Details from async');
                console.warn(err);
            });

    };

    const getStaffsByLocationList = async (locId) => {

        let toInput = {
            locations_id: locId,
        };

        await fetch(`${API_BASE}/app/staff/staffbylocation`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        })
            .then((response) => response.json())
            .then((response) => {
                if (response) {
                    setStaffList(response.model);
                } else {
                    Snackbar.show({ text: 'Unable to load data', duration: Snackbar.LENGTH_SHORT })
                }
            })
            .catch((error) => {
                console.error('STOCK INVENTORY There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
            })
    };

    const onSelect = (ind) => {
        let temp = filterWorkList;
        temp.map((item, index) => {
            if (index == ind) {
                item.isSelected = !item.isSelected;
            }
        });
        let tempData = [];
        temp.map(item => { tempData.push(item); });
        setFilterWorkList(tempData);
    }

    const clearAll = () => {
        let temp = filterWorkList;
        temp.map((item, index) => {
            item.isSelected = false;
        });
        let tempData = [];
        temp.map(item => { tempData.push(item); });
        setFilterWorkList(tempData);
    }

    const selectAll = () => {
        let temp = filterWorkList;
        temp.map((item, index) => {
            item.isSelected = true;
        });
        let tempData = [];
        temp.map(item => { tempData.push(item); });
        setFilterWorkList(tempData);
    }

    const getCounts = () => {
        let temp = filterWorkList;
        let tempData = [];
        temp.map((item) => {
            if (item.isSelected) {
                tempData.push(item.id);
            }
        }).join(',');
        return tempData;
    }

    const handleAssignTask = async () => {

        if (Keyboard.isVisible) {
            Keyboard.dismiss();
        }

        if (selectedStaff.length == 0) {
            Snackbar.show({ text: 'Please select staff', duration: Snackbar.LENGTH_SHORT })
        } else {

            setLoading(true);

            setModalVisible(!modalVisible);

            console.log(
                " locations_id: " + locationId +
                " staffids: " + selectedStaff.toString() +
                " bystaffs_id: " + byStaffId +
                " workids: " + selectedWorkIds +
                " worktype: " + "emergency" +
                " remarks: " + remarks
            )

            let toInput = {
                locations_id: locationId,
                staffids: selectedStaff.toString(),
                bystaffs_id: byStaffId,
                workids: selectedWorkIds,
                worktype: "emergency",
                remarks: remarks
            };

            await fetch(`${API_BASE}/app/work/assignworkbatch`, {
                method: "POST",
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(toInput)
            })
                .then((response) => response.json())
                .then((response) => {
                    setLoading(false);
                    Snackbar.show({ text: '' + response.work, duration: Snackbar.LENGTH_SHORT })

                    if (response.code === 1) {
                        clearValues();
                    }

                })
                .catch((error) => {
                    setLoading(false);
                    console.error('ASSIGN WORK There was an error!', error);
                    Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
                })
        }

    }

    const handleAssignWork = () => {

        console.log("GetCounts: " + getCounts().length);

        if (getCounts().length == 0) {
            Snackbar.show({ text: 'Please select work', duration: Snackbar.LENGTH_SHORT })
        } else {
            console.log("Assign Work Pressed : " + getCounts().toString());
            setSelectedWorkIds("" + getCounts().toString());
            setModalVisible(true);
            getData();
        }

    }

    const clearValues = () => {
        setRemarks("");
        setSelectedStaff([]);
        setSelectedWorkIds("");
        setSearch("");
        clearAll();
        getWork(locationId);
    }

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = workList.filter(function (item) {
                const itemData = item.customerno ? item.customerno + " " + item.customername + " " + item.city + " " + item.customerphone + " " + item.remarks : ''.toUpperCase();
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

        console.log("FromDate: " + moment(fromDate).format("DD-MMM-YYYY") + " ToDate: " + moment(toDate).format("DD-MMM-YYYY"));

        getWork(locationId);

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
                        inputContainerStyle={{ backgroundColor: 'white' }}
                    />

                    <View style={styles.contentViewStyleRow}>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading1}>From Date</Text>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Icon name="calendar" type="font-awesome" size={20} color="#044F87" onPress={showFromDatepicker} />
                                <Text style={styles.textContent1}>{moment(fromDate).format("DD-MMM-YYYY")}</Text>
                            </View>
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading1}>To Date</Text>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Icon name="calendar" type="font-awesome" size={20} color="#044F87" onPress={showToDatepicker} />
                                <Text style={styles.textContent1}>{moment(toDate).format("DD-MMM-YYYY")}</Text>
                            </View>
                            <View style={styles.viewStyle} />
                        </View>


                        <TouchableOpacity onPress={() => { searchByDate(); }} style={{ marginTop: 10, marginStart: 5, alignSelf: "center", }}>
                            <View style={{ backgroundColor: Colors.primary, padding: 10, borderWidth: 1, borderRadius: 5, borderColor: Colors.primary }}>
                                <Icon name="search" type="font-awesome" size={20} color="#fff" />
                            </View>
                        </TouchableOpacity>

                    </View>

                    <View style={{ width: '100%', flexDirection: 'row', padding: 10, alignItems: "center", justifyContent: "space-between" }}>

                        {/* <TouchableHighlight onPress={() => { clearAll(); }} underlayColor={Colors.primaryLight2}>
                            <Icon name="close" type="material-icons" size={25} color={Colors.darkGrey} />
                        </TouchableHighlight> */}

                        <Text style={styles.textHeading} onPress={() => { clearAll(); }}>Unselect All</Text>

                        {/* <Text>{getCounts()}</Text> */}

                        <Text style={styles.textHeading} onPress={() => { selectAll() }}>Select All</Text>

                    </View>

                    <View style={{ width: '100%', flexDirection: 'row', padding: 10, alignItems: "center", justifyContent: "space-around" }}>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>

                            <View style={{ width: 15, height: 15, borderRadius: 2, borderWidth: 1, backgroundColor: Colors.white, borderColor: Colors.primary, marginEnd: 5 }} />
                            <Text style={styles.textStyle1}>Not Assigned</Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>

                            <View style={{ width: 15, height: 15, borderRadius: 2, borderWidth: 1, backgroundColor: Colors.lightYellow, borderColor: Colors.primary, marginEnd: 5 }} />
                            <Text style={styles.textStyle1}>Assigned</Text>

                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>

                            <View style={{ width: 15, height: 15, borderRadius: 2, borderWidth: 1, backgroundColor: Colors.lightGreen1, borderColor: Colors.primary, marginEnd: 5 }} />
                            <Text style={styles.textStyle1}>Completed</Text>

                        </View>

                    </View>

                    <View style={styles.centeredView}>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                clearValues();
                                setModalVisible(!modalVisible);
                            }}>
                            <View style={styles.centeredView}>
                                <KeyboardAvoidingView style={styles.modalView}>
                                    <ScrollView keyboardShouldPersistTaps='handled'>
                                        <View>
                                            <Text style={styles.modalHeading}>Select Staff</Text>
                                            <MultiSelect
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                search="Yes"
                                                searchPlaceholder='Search Staff'
                                                data={staffList}
                                                maxHeight={500}
                                                keyboardAvoiding
                                                activeColor={Colors.primaryLight2}
                                                labelField="empname"
                                                valueField="id"
                                                placeholder={!(staffFocus) ? '- Select -' : '...'}
                                                value={selectedStaff}
                                                onFocus={() => { setStaffFocus(true); }}
                                                onBlur={() => { setStaffFocus(false); }}
                                                onChange={item => {
                                                    setStaffFocus(false);
                                                    setSelectedStaff(item);
                                                }}
                                                renderSelectedItem={(item, unSelect) => (
                                                    <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                                                        <View style={styles.selectedStyle}>
                                                            <Text style={styles.textSelectedStyle}>{item.empname}</Text>
                                                            <Icon name="close" type="material-icons" size={20} color={Colors.darkGrey} />
                                                        </View>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                            <View style={styles.viewStyle} />

                                            <View style={styles.modalContentViewStyle}>
                                                <Text style={styles.modalTextHeading}>Remarks</Text>
                                                <TextInput style={styles.modalTextContent} value={remarks} onChangeText={text => setRemarks(text)} />
                                                <View style={styles.viewStyle} />
                                            </View>

                                            <TouchableHighlight style={[styles.button]} onPress={() => { handleAssignTask(); }}>
                                                <Text style={styles.textStyle}>Assign</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </ScrollView>

                                </KeyboardAvoidingView>
                            </View>
                        </Modal>
                    </View>

                    <FlatList
                        data={filterWorkList}
                        keyExtractor={(item, index) => { return index.toString(); }}
                        renderItem={({ item, index }) => {
                            return (
                                <AllEmergencyListItem
                                    item={item}
                                    onSelect={() => { onSelect(index); }}
                                    isCheckbox={true}
                                    functionGetWork={() => { getWork(locationId); }}
                                />
                            );
                        }}
                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={<NoDataFound />}
                    />

                    <TouchableHighlight style={styles.icon} onPress={() => { handleAssignWork() }} underlayColor={Colors.primaryLight2}>
                        <View>
                            <Text style={{ color: Colors.white, fontFamily: Fonts.semiBold, fontSize: FontSize.medium, paddingBottom: 4, textAlign: "center" }}>Assign Work</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            }

        </View>
    )
}

AllEmergency.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default AllEmergency

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    textHeading: {
        padding: 5,
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 5,
        color: Colors.primary,
        fontFamily: Fonts.semiBold,
        fontSize: FontSize.smallMedium,
        backgroundColor: Colors.white,
    },
    icon: {
        position: "absolute",
        bottom: 20,
        right: 10,
        left: Dimensions.get("screen").width - 125,
        zIndex: 1,
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        flex: 1,
        width: Dimensions.get("screen").width - 20,
        height: Dimensions.get("screen").height / 2,
        backgroundColor: Colors.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.primary,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        backgroundColor: Colors.primary,
        margin: 20,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textStyle1: {
        color: Colors.black,
        fontFamily: Fonts.regular,
    },
    modalHeading: {
        color: Colors.primary,
        fontSize: FontSize.medium,
        fontFamily: Fonts.bold
    },
    dropdown: {
        height: 50,
    },
    placeholderStyle: {
        minHeight: 50,
        fontFamily: Fonts.regular,
        color: Colors.lightGrey,
        fontSize: FontSize.medium,
        textAlignVertical: "center",
    },
    selectedTextStyle: {
        minHeight: 50,
        color: Colors.black,
        fontFamily: Fonts.regular,
        fontSize: FontSize.medium,
        textAlignVertical: "center",
    },
    inputSearchStyle: {
        minHeight: 50,
        fontSize: FontSize.medium,
        fontFamily: Fonts.regular,
        color: Colors.lightGrey,
    },
    itemTextStyle: {
        fontSize: FontSize.medium,
        fontFamily: Fonts.regular,
        color: Colors.black,
    },
    viewStyle: {
        backgroundColor: Colors.grey,
        height: 2,
        marginVertical: 10
    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: Colors.white,
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: Colors.lightGrey
    },
    textSelectedStyle: {
        marginRight: 5,
        fontSize: FontSize.small,
        color: Colors.primary
    },
    modalContentViewStyle: {
        flex: 1
    },
    modalTextHeading: {
        color: Colors.lightGrey,
    },
    modalTextContent: {
        color: Colors.black,
        paddingTop: 10,
        paddingBottom: 5,
        fontSize: FontSize.medium,
    },
    contentViewStyleRow: {
        flexDirection: "row",
        padding: 5
    },
    contentViewStyle: {
        margin: 5,
        flex: 1
    },
    textHeading1: {
        color: Colors.primary,
    },
    textContent1: {
        color: Colors.black,
        paddingTop: 10,
        paddingBottom: 5,
        marginStart: 10,
        fontSize: FontSize.smallMedium,
    },
});