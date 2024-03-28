import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableHighlight, KeyboardAvoidingView, ActivityIndicator, Keyboard } from 'react-native'
import { Colors, FontSize, Fonts } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import Snackbar from 'react-native-snackbar';
import { API_BASE } from '../setupProxy';

const IssueMaterial = ({ navigation }) => {

    const [profileDetails, setProfileDetails] = useState([]);

    const [loading, setLoading] = useState(false);

    const [locationId, setLocationId] = useState(null);
    const [byStaffId, setByStaffId] = useState(null);

    const [staffList, setStaffList] = useState([]);
    const [staffValue, setStaffValue] = useState(null);
    const [staffFocus, setStaffFocus] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState("");

    const [stockList, setStockList] = useState([]);
    const [stockValue, setStockValue] = useState(null);
    const [stockFocus, setStockFocus] = useState(false);
    const [selectedStock, setSelectedStock] = useState("");

    const [selectedStockQty, setSelectedStockQty] = useState("");

    const [quantity, setQuantity] = useState(null);
    const [reason, setReason] = useState("");
    const [remarks, setRemarks] = useState("");
    const [dateTime, setDateTime] = useState(moment().format("YYYY-MM-DD[T]HH:mm"));

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
                getStockList(parsedEmpDetails[0].locations_id);
            })
            .catch(err => {
                console.warn('Error restoring Emp Details from async');
                console.warn(err);
            });

    };

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

    const getStockList = async (locId) => {

        setLoading(true);

        let toInput = {
            locations_id: locId,
        };

        await fetch(`${API_BASE}/app/products/storestock`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        })
            .then((response) => response.json())
            .then((response) => {
                setLoading(false);
                if (response) {
                    setStockList(response.model);
                } else {
                    Snackbar.show({ text: 'Unable to load data', duration: Snackbar.LENGTH_SHORT })
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error('STOCK INVENTORY There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
            })

    }

    const deliverData = async () => {

        console.log(
            " bystaff id: " + byStaffId +
            " datetime: " + dateTime +
            " locationid: " + locationId +
            " productId: " + selectedStock +
            " selqty: " + selectedStockQty +
            " qty: " + quantity +
            " reason: " + reason +
            " remarks: " + remarks +
            " staff id: " + selectedStaff
        )


        if (Keyboard.isVisible) {
            Keyboard.dismiss();
        }

        let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;

        if (selectedStaff == null || selectedStaff === "" || selectedStaff === "- Select -") {
            Snackbar.show({ text: 'Please select staff', duration: Snackbar.LENGTH_SHORT })
        }
        else if (selectedStock == null || selectedStock === "" || selectedStock === "- Select -") {
            Snackbar.show({ text: 'Please select product', duration: Snackbar.LENGTH_SHORT })
        }
        else if (selectedStockQty === "0.00" || selectedStockQty === "0.0" || selectedStockQty === "0") {
            Snackbar.show({ text: 'No Stock availabe for the selected product', duration: Snackbar.LENGTH_SHORT })
        }
        else if (parseFloat(selectedStockQty) < parseFloat(quantity)) {
            Snackbar.show({ text: 'Not enough stock available', duration: Snackbar.LENGTH_SHORT })
        }
        else if (quantity == "0.00" || quantity == "0.0" || quantity == "0" || quantity.startsWith("0.00")) {
            Snackbar.show({ text: 'Enter a valid quantity', duration: Snackbar.LENGTH_SHORT })
        }
        else if (quantity == "" || quantity === null || quantity === " ") {
            Snackbar.show({ text: 'Enter quantity', duration: Snackbar.LENGTH_SHORT })
        }
        else if (format.test(quantity) || quantity.includes(" ")) {
            Snackbar.show({ text: 'Enter a valid quantity', duration: Snackbar.LENGTH_SHORT })
        }
        else if (reason === "" || reason === " ") {
            Snackbar.show({ text: 'Enter reason', duration: Snackbar.LENGTH_SHORT })
        }
        else {

            setLoading(true);

            console.log(
                " bystaff id: " + byStaffId +
                " datetime: " + dateTime +
                " locationid: " + locationId +
                " productId: " + selectedStock +
                " selqty: " + selectedStockQty +
                " qty: " + quantity +
                " reason: " + reason +
                " remarks: " + remarks +
                " staff id: " + selectedStaff
            )

            let toInput = {
                bystaffs_id: byStaffId,
                datetime: dateTime,
                locations_id: locationId,
                products_id: selectedStock,
                quantity: quantity,
                reason: reason,
                remarks: remarks,
                staffs_id: selectedStaff
            };

            await fetch(`${API_BASE}/app/products/deliverstock`, {
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
                    console.error('DELIVER STOCK There was an error!', error);
                    Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
                })
        }

    }

    const clearValues = () => {

        setStaffValue(null);
        setStaffFocus(false);
        setSelectedStaff("");
        setStockValue(null);
        setStockFocus(false);
        setSelectedStock("");
        setSelectedStockQty("");
        setQuantity(null);
        setDateTime(moment().format("YYYY-MM-DD[T]HH:mm"));
        setReason("");
        setRemarks("");
    }

    return (
        <KeyboardAvoidingView style={styles.container}>

            <ScrollView keyboardShouldPersistTaps='handled'>

                {loading ?
                    <ActivityIndicator />
                    :

                    <View style={{ flex: 1 }}>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Location</Text>
                            <Text style={styles.textContent}>{profileDetails.locations_id}</Text>
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Deliverd by Staff</Text>
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
                                    setStaffFocus(false);
                                    setSelectedStaff(item.id);
                                }}
                            />
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Select Product</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                itemTextStyle={styles.itemTextStyle}
                                search="Yes"
                                searchPlaceholder='Search Product'
                                data={stockList}
                                keyboardAvoiding
                                maxHeight={300}
                                activeColor={Colors.primaryLight2}
                                labelField="product.name"
                                valueField="products_id"
                                placeholder={!(stockFocus) ? '- Select -' : '...'}
                                value={stockValue}
                                onFocus={() => { setStockFocus(true); }}
                                onBlur={() => { setStockFocus(false); }}
                                onChange={item => {
                                    setStockValue(item.products_id);
                                    setStockFocus(false);
                                    setSelectedStock(item.products_id);
                                    setSelectedStockQty(item.stock);
                                }}
                            />
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Available Stock Quantity</Text>
                            <Text style={styles.textContent}>{selectedStockQty}</Text>
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Quantity</Text>
                            <TextInput style={styles.textContent} keyboardType='decimal-pad' value={quantity} onChangeText={text => setQuantity(text)} />
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Date Time</Text>
                            <Text style={styles.textContent}>{dateTime}</Text>
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Reason for Delivery</Text>
                            <TextInput style={styles.textContent} value={reason} onChangeText={text => setReason(text)} />
                            <View style={styles.viewStyle} />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Remarks</Text>
                            <TextInput style={styles.textContent} value={remarks} onChangeText={text => setRemarks(text)} />
                            <View style={styles.viewStyle} />
                        </View>

                        <View>
                            <TouchableHighlight onPress={() => { deliverData() }} style={styles.touchableOpacity}>
                                <Text style={styles.buttonText}>Deliver</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                }

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

IssueMaterial.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default IssueMaterial

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
        padding: 10
    },
    contentViewStyle: {
        margin: 10,
        flex: 1
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
    viewStyle: {
        backgroundColor: Colors.grey,
        height: 2,
    },
    touchableOpacity: {
        backgroundColor: Colors.primary,
        margin: 20,
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
});