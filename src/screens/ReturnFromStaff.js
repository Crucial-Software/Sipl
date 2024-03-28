import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard, ActivityIndicator } from 'react-native'
import { Colors, FontSize, Fonts } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import PropTypes from 'prop-types';
import { Dropdown } from 'react-native-element-dropdown';
import { Icon } from 'react-native-elements';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../setupProxy';
import Snackbar from 'react-native-snackbar';

const ReturnToStore = ({ navigation }) => {

    const [loading, setLoading] = useState(false);

    const [profileDetails, setProfileDetails] = useState([]);
    const [locationId, setLocationId] = useState(null);
    const [byStaffId, setByStaffId] = useState(null);

    const [materialList, setMaterialList] = useState([]);
    const [materialValue, setMaterialValue] = useState(null);
    const [materialFocus, setMaterialFocus] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState("");

    const [currentStock, setCurrentStock] = useState(null);
    const [returnQuantity, setReturnQuantity] = useState(null);
    const [reason, setReason] = useState("");
    const [remarks, setRemarks] = useState("");

    const [staffList, setStaffList] = useState([]);
    const [staffValue, setStaffValue] = useState(null);
    const [staffFocus, setStaffFocus] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState("");

    useEffect(() => {

        getData();

    }, []);

    const getData = async () => {

        await AsyncStorage.getItem('userEmpDetails')
            .then(stringifiedEmpDetails => {

                const parsedEmpDetails = JSON.parse(stringifiedEmpDetails);

                if (!parsedEmpDetails || typeof parsedEmpDetails !== 'object') return;

                setProfileDetails(parsedEmpDetails[0]);
                setByStaffId(parsedEmpDetails[0].id);
                setLocationId(parsedEmpDetails[0].locations_id);
                getStaffsByLocationList(parsedEmpDetails[0].locations_id);
            })
            .catch(err => {
                console.warn('Error restoring Emp Details from async');
                console.warn(err);
            });
    }

    const getStaffsByLocationList = async (locId) => {

        setLoading(true);

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
                setLoading(false);
                if (response) {
                    setStaffList(response.model);
                } else {
                    Snackbar.show({ text: 'Unable to load data', duration: Snackbar.LENGTH_SHORT })
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error('ISSUE MATERIAL STAFF There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
            })
    };

    const getStock = async (staffId) => {

        setLoading(true);

        let toInput = {
            staffs_id: staffId,
        };

        await fetch(`${API_BASE}/app/products/stockatstaff`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        })
            .then((response) => response.json())
            .then((response) => {

                setLoading(false);
                if (response) {
                    console.log("response: " + response);
                    setMaterialList(response);
                } else {
                    Snackbar.show({ text: 'Unable to load data', duration: Snackbar.LENGTH_SHORT })
                }

            })
            .catch((error) => {
                setLoading(false);
                console.error('RETURN TO STORE There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })

            })
    }

    const [date, setDate] = useState(new Date());

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    const showDatepicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            onChange: onDateChange,
            mode: 'date',
            is24Hour: true,
        });
    };

    const returnItemToStore = () => {
        if (Keyboard.isVisible) {
            Keyboard.dismiss();
        }

        let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;

        if (!selectedMaterial && !returnQuantity && !reason && !selectedStaff) {
            Snackbar.show({ text: 'Enter All Details', duration: Snackbar.LENGTH_SHORT });
        } else if (!selectedStaff) {
            Snackbar.show({ text: 'Select Staff', duration: Snackbar.LENGTH_SHORT });
        } else if (!selectedMaterial) {
            Snackbar.show({ text: 'Select Product', duration: Snackbar.LENGTH_SHORT });
        } else if (!returnQuantity) {
            Snackbar.show({ text: 'Enter Return Quantity', duration: Snackbar.LENGTH_SHORT });
        } else if (isNaN(returnQuantity) || returnQuantity.startsWith("0.00")) {
            Snackbar.show({ text: 'Enter Valid Quantity', duration: Snackbar.LENGTH_SHORT });
        } else if (returnQuantity == "" || returnQuantity == null || returnQuantity === " ") {
            Snackbar.show({ text: 'Enter quantity', duration: Snackbar.LENGTH_SHORT })
        } else if (format.test(returnQuantity) || returnQuantity.includes(" ") || returnQuantity == "0" || returnQuantity == "0.0" || returnQuantity == "0.00") {
            Snackbar.show({ text: 'Enter a valid quantity', duration: Snackbar.LENGTH_SHORT })
        } else if (!reason) {
            Snackbar.show({ text: 'Enter Reason', duration: Snackbar.LENGTH_SHORT });
        } else if (returnQuantity>currentStock){
            Snackbar.show({ text: 'You don\'t have enough currentStock', duration: Snackbar.LENGTH_SHORT });
        }
        else {

            setLoading(true);

            console.log(
                " locations_id: " + locationId +
                " staffs_id: " + staffValue +
                " receivedby_id: " + byStaffId +
                " products_id: " + materialValue +
                " quantity: " + returnQuantity +
                " datetime: " + moment(date).format("YYYY-MM-DD") +
                " reason: " + reason +
                " remarks: " + remarks
            )

            let toInput = {
                locations_id: locationId,
                staffs_id: staffValue,
                receivedby_id: byStaffId,
                products_id: materialValue,
                quantity: returnQuantity,
                datetime: moment(date).format("YYYY-MM-DD"),
                reason: reason,
                remarks: remarks
            };

            fetch(`${API_BASE}/app/products/returnstock`, {
                method: "POST",
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(toInput)
            })
                .then((response) => response.json())
                .then((response) => {

                    setLoading(false);
                    Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT })

                    if (response.code === 1) {
                        clearValues();
                    }

                })
                .catch((error) => {
                    setLoading(false);
                    console.error('RETURN TO STORE There was an error!', error);
                    Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
                })

        }
    }

    const clearValues = () => {
        setMaterialList([]);
        setMaterialValue(null);
        setMaterialFocus(false);
        setSelectedMaterial("");
        setCurrentStock(null);
        setReturnQuantity(null);
        setReason("");
        setRemarks("");
        setStaffValue(null);
        setStaffFocus(false);
        setSelectedStaff("");
    }


    return (

        <KeyboardAvoidingView style={styles.container}>
            <ScrollView keyboardShouldPersistTaps='handled' >

                {loading ?
                    <ActivityIndicator />
                    :
                    <View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Recieved by Staff</Text>
                            <Text style={styles.textContent}>{profileDetails.empname}</Text>
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Select Staff</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                itemTextStyle={styles.itemTextStyle}
                                search="Yes"
                                searchPlaceholder='Search Staff'
                                data={staffList}
                                maxHeight={300}
                                keyboardAvoiding
                                activeColor={Colors.primaryLight2}
                                labelField="empname"
                                valueField="id"
                                placeholder={!(staffFocus) ? '- Select -' : '...'}
                                value={staffValue}
                                onFocus={() => { setStaffFocus(true); }}
                                onBlur={() => { setStaffFocus(false); }}
                                onChange={item => {
                                    setStaffValue(item.id);
                                    getStock(item.id);
                                    setStaffFocus(false);
                                    setSelectedStaff(item.id);

                                    setMaterialValue(null);
                                    setMaterialFocus(false);
                                    setSelectedMaterial("");
                                    setCurrentStock(null);
                                }}
                            />
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Product</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                itemTextStyle={styles.itemTextStyle}
                                search="Yes"
                                searchPlaceholder='Search Material'
                                data={materialList}
                                maxHeight={300}
                                keyboardAvoiding
                                activeColor={Colors.primaryLight2}
                                labelField="name"
                                valueField="products_id"
                                placeholder={!(materialFocus) ? '- Select -' : '...'}
                                value={materialValue}
                                onFocus={() => { setMaterialFocus(true); }}
                                onBlur={() => { setMaterialFocus(false); }}
                                onChange={item => {
                                    setMaterialValue(item.products_id);
                                    setMaterialFocus(false);
                                    setSelectedMaterial(item.name);
                                    setCurrentStock(item.currentstock);
                                }}
                            />
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Current Stock</Text>
                            <Text style={styles.textContent}>{currentStock}</Text>
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Return Quantity</Text>
                            <TextInput style={styles.textContent} keyboardType='numeric' value={returnQuantity} onChangeText={(returnQuantity) => setReturnQuantity(returnQuantity)} />
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Reason of Return</Text>
                            <TextInput style={styles.textContent} value={reason} onChangeText={(reason) => setReason(reason)} />
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Remarks</Text>
                            <TextInput style={styles.textContent} value={remarks} onChangeText={(remarks) => setRemarks(remarks)} />
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Date</Text>
                            <View style={styles.contentSubViewStyleRow}>
                                <View style={{ marginEnd: 10 }}>
                                    <Icon name="calendar" type="font-awesome" size={20} color="#044F87" onPress={showDatepicker} />
                                </View>
                                <Text style={styles.textContent}>{moment(date).format("DD-MMM-YYYY")}</Text>
                            </View>
                            <View style={styles.viewStyle} />
                        </View>

                        <TouchableOpacity style={styles.touchableOpacity} onPress={() => { returnItemToStore() }}>
                            <Text style={styles.buttonText}>Return</Text>
                        </TouchableOpacity>

                    </View>
                }

            </ScrollView >

        </KeyboardAvoidingView>

    )
}

ReturnToStore.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default ReturnToStore

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
        padding: 10
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
    touchableOpacity: {
        backgroundColor: Colors.primary,
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 50,
        padding: 12,
    },
    buttonText: {
        color: Colors.white,
        textAlign: "center",
        fontSize: FontSize.medium,
        fontFamily: Fonts.bold,
    },
    dropdown: {
        height: 50
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
    contentSubViewStyleRow: {
        flexDirection: "row",
        alignItems: "center",
        height: 45,
    },
});