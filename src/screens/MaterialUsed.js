import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard, ActivityIndicator, FlatList } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { Colors, Fonts, FontSize } from '../common/ConstantStyles';
import Snackbar from 'react-native-snackbar';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../setupProxy';
import moment from 'moment';
import NoDataFound from '../common/NoDataFound';

const MaterialUsed = ({ navigation, route }) => {

    const { workId } = route.params;

    const [loading, setLoading] = useState(false);

    const [materialData, setMaterialData] = useState([]);

    const [materialList, setMaterialList] = useState([]);
    const [materialValue, setMaterialValue] = useState(null);
    const [materialFocus, setMaterialFocus] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState("");

    const [materialQuantity, setMaterialQuantity] = useState("");
    const [materialRemarks, setMaterialRemarks] = useState("");

    const [received, setReceived] = useState(null);
    const [consumed, setConsumed] = useState(null);
    const [currentStock, setCurrentStock] = useState(null);

    const [staffId, setStaffId] = useState(null);
    const [locationId, setLocationId] = useState(null);

    useEffect(() => {

        getData();

    }, []);

    const getData = async () => {

        await AsyncStorage.getItem('userEmpDetails')
            .then(stringifiedEmpDetails => {

                const parsedEmpDetails = JSON.parse(stringifiedEmpDetails);

                if (!parsedEmpDetails || typeof parsedEmpDetails !== 'object') return;

                getMaterialUsedList(parsedEmpDetails[0].id);
                getStock(parsedEmpDetails[0].id);
                setStaffId(parsedEmpDetails[0].id);
                setLocationId(parsedEmpDetails[0].locations_id);
            })
            .catch(err => {
                console.warn('Error restoring Emp Details from async');
                console.warn(err);
            });

    };

    const getMaterialUsedList = async(staffId) => {
        
        setLoading(true);

        let toInput = {
            staffs_id: staffId,
            works_id: workId,
            worktype: "tracker"
        };

        await fetch(`${API_BASE}/app/products/consumptionhistorybywork`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        })
            .then((response) => response.json())
            .then((response) => {

                setLoading(false);
                if (response) {
                    setMaterialData(response);
                } else {
                    Snackbar.show({ text: 'Unable to load data', duration: Snackbar.LENGTH_SHORT })
                }

            })
            .catch((error) => {
                setLoading(false);
                console.error('TRACKER MATERIAL USED There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })

            })
    }

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
                    setMaterialList(response);
                } else {
                    Snackbar.show({ text: 'Unable to load data', duration: Snackbar.LENGTH_SHORT })
                }

            })
            .catch((error) => {
                setLoading(false);
                console.error('TRACKER MATERIAL USED There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })

            })

    }

    const saveMaterial = async () => {

        if (Keyboard.isVisible) {
            Keyboard.dismiss();
        }

        let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;

        if (!selectedMaterial && !materialQuantity) {
            Snackbar.show({ text: 'Enter Material Details', duration: Snackbar.LENGTH_SHORT });
        } else if (!selectedMaterial) {
            Snackbar.show({ text: 'Enter Material Name', duration: Snackbar.LENGTH_SHORT });
        } else if (!materialQuantity) {
            Snackbar.show({ text: 'Enter Material Quantity', duration: Snackbar.LENGTH_SHORT });
        } else if (isNaN(materialQuantity)) {
            Snackbar.show({ text: 'Enter Valid Quantity', duration: Snackbar.LENGTH_SHORT });
        } else if (materialQuantity == "" || materialQuantity == null || materialQuantity === " ") {
            Snackbar.show({ text: 'Enter quantity', duration: Snackbar.LENGTH_SHORT })
        } else if (format.test(materialQuantity) || materialQuantity.includes(" ") || materialQuantity == "0" || materialQuantity == "0.0" || materialQuantity == "0.00") {
            Snackbar.show({ text: 'Enter a valid quantity', duration: Snackbar.LENGTH_SHORT })
        }
        else {

            setLoading(true);

            console.log(
                " staffs_id: " + staffId +
                " products_id: " + materialValue +
                " works_id: " + workId +
                " locations_id: " + locationId +
                " quantity: " + materialQuantity +
                " remarks: " + materialRemarks +
                " consumedate id: " + moment().format("YYYY-MM-DD HH:mm") +
                " worktype: " + "tracker"
            )

            let toInput = {
                staffs_id: staffId,
                products_id: materialValue,
                works_id: workId,
                locations_id: locationId,
                quantity: materialQuantity,
                remarks: materialRemarks,
                consumedate: moment().format("YYYY-MM-DD HH:mm"),
                worktype: "tracker"
            };

            await fetch(`${API_BASE}/app/products/consumestock`, {
                method: "POST",
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(toInput)
            })
                .then((response) => response.json())
                .then((response) => {

                    setLoading(false);
                    Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT })

                    if (response.code === 1) {
                        getMaterialUsedList(staffId);
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
        setSelectedMaterial("");
        setMaterialValue(null);
        setMaterialFocus(false);
        setReceived(null);
        setConsumed(null);
        setCurrentStock(null);
        setMaterialQuantity("");
        setMaterialRemarks("");
    }


    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView keyboardShouldPersistTaps='handled' >

                {loading ?
                    <ActivityIndicator />
                    :
                    <View>

                        <View style={{ padding: 5 }}>

                            <Text style={styles.headingText}>Add Material</Text>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>Material Name</Text>
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
                                        setReceived(item.received);
                                        setConsumed(item.consumed);
                                        setCurrentStock(item.currentstock);
                                    }}
                                />
                                <View style={styles.viewStyle} />
                            </View>

                            <View style={styles.contentViewStyleRow}>
                                <View style={styles.contentViewStyle}>
                                    <Text style={styles.textHeading}>Recieved</Text>
                                    <Text style={styles.textContent}>{received}</Text>
                                    <View style={styles.viewStyle} />
                                </View>
                                <View style={styles.contentViewStyle}>
                                    <Text style={styles.textHeading}>Consumed</Text>
                                    <Text style={styles.textContent}>{consumed}</Text>
                                    <View style={styles.viewStyle} />
                                </View>
                                <View style={styles.contentViewStyle}>
                                    <Text style={styles.textHeading}>Current</Text>
                                    <Text style={styles.textContent}>{currentStock}</Text>
                                    <View style={styles.viewStyle} />
                                </View>
                            </View>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>Quantity</Text>
                                <TextInput style={styles.textContent} keyboardType='numeric' value={materialQuantity} onChangeText={(materialQuantity) => setMaterialQuantity(materialQuantity)} />
                                <View style={styles.viewStyle} />
                            </View>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>Remarks</Text>
                                <TextInput style={styles.textContent} value={materialRemarks} onChangeText={(materialRemarks) => setMaterialRemarks(materialRemarks)} />
                                <View style={styles.viewStyle} />
                            </View>

                        </View>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around" }}>

                            <TouchableOpacity style={styles.touchableOpacity} onPress={() => { saveMaterial() }}>
                                <Text style={styles.buttonText}>Add</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.itemContentHeading}>
                            <Text style={[{ fontWeight: "bold" }, styles.itemListContent2]} >Name</Text>
                            <Text style={[{ fontWeight: "bold" }, styles.itemListContent1]} >Quantity</Text>
                            <Text style={[{ fontWeight: "bold" }, styles.itemListContent2]} >Remarks</Text>
                            <Text style={[{ fontWeight: "bold" }, styles.itemListContent15]} >Date</Text>
                        </View>

                        <View>
                            <ScrollView contentContainerStyle={{ width: '100%' }} horizontal={true}>

                                <FlatList
                                    data={materialData}
                                    width='100%'
                                    extraData={materialData}
                                    key={(item, index) => { return index.toString(); }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={styles.itemContent} key={"mtrl" + index}>
                                                <Text style={styles.itemListContent2}>{item.name}</Text>
                                                <Text style={styles.itemListContent1}>{item.quantity}</Text>
                                                <Text style={styles.itemListContent2}>{item.remarks}</Text>
                                                <Text style={styles.itemListContent15}>{moment(item.consumedate).format("DD-MMM-YYYY")}</Text>
                                            </View>
                                        );
                                    }}
                                    ListEmptyComponent={<NoDataFound />}
                                />
                            </ScrollView>
                        </View>

                    </View>
                }

            </ScrollView >

        </KeyboardAvoidingView>
    )
}

MaterialUsed.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
};

export default MaterialUsed

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    headingText: {
        fontSize: FontSize.medium,
        fontWeight: "bold",
        color: Colors.black,
        margin: 5,
    },
    contentViewStyleRow: {
        flex: 1,
        flexDirection: "row",
    },
    contentViewStyle: {
        flex: 1,
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
    viewStyle: {
        backgroundColor: Colors.grey,
        height: 2,
    },
    touchableOpacity: {
        backgroundColor: Colors.primary,
        marginVertical: 10,
        width: 150,
        alignSelf: "center",
        borderRadius: 50,
        padding: 12
    },
    buttonText: {
        color: Colors.white,
        textAlign: "center",
        fontSize: FontSize.medium,
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
    itemContentHeading: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        backgroundColor: Colors.lightGrey,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    itemContent: {
        flex: 1,
        padding: 5,
        backgroundColor: Colors.white,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    itemListContent1:{
        flex: 1, 
        color: Colors.black, 
        fontSize: FontSize.smallMedium,
    },
    itemListContent15:{
        flex: 1.5, 
        color: Colors.black, 
        fontSize: FontSize.smallMedium,
    },
    itemListContent2:{
        flex: 2, 
        color: Colors.black, 
        fontSize: FontSize.smallMedium,
    }

});