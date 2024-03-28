import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, TouchableHighlight, PermissionsAndroid, Image, Alert } from 'react-native'
import { Colors, FontSize, Fonts } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import { API_BASE } from '../setupProxy';
import { SearchBar, Icon } from 'react-native-elements';
import moment from 'moment';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Snackbar from 'react-native-snackbar';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-native-element-dropdown';
import { launchCamera } from 'react-native-image-picker';
import NoDataFound from '../common/NoDataFound';
import StoreStockListItem from '../components/StoreStockListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

const shift = [
    { label: 'First', value: '1' },
    { label: 'Second', value: '2' },
    { label: 'Third', value: '3' },
];

const EmergencyInventory = ({ navigation }) => {

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [stockList, setStockList] = useState([]);
    const [filterStockList, setFilterStockList] = useState([]);

    const [shiftValue, setShiftValue] = useState(null);
    const [shiftFocus, setShiftFocus] = useState(false);
    const [shiftSelected, setShiftSelected] = useState("");

    const [cameraPhoto, setCameraPhoto] = useState("");
    const [cameraPhotoUri, setCameraPhotoUri] = useState("");

    const [staffId, setStaffId] = useState(null);
    const [userToken, setUserToken] = useState("");

    useEffect(() => {

        getData();

    }, []);

    const getData = async () => {

        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            setUserToken(token);
        }

        await AsyncStorage.getItem('userEmpDetails')
            .then(stringifiedEmpDetails => {

                const parsedEmpDetails = JSON.parse(stringifiedEmpDetails);

                if (!parsedEmpDetails || typeof parsedEmpDetails !== 'object') return;

                setStaffId(parsedEmpDetails[0].id);
                getStock(parsedEmpDetails[0].locations_id);

            })
            .catch(err => {
                console.warn('Error restoring Emp Details from async');
                console.warn(err);
            });

    };

    const getStock = async (locId) => {

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
                    setFilterStockList(response.model);
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

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = stockList.filter(function (item) {
                const itemData = item.product.name ? item.product.name.toUpperCase() + " " + item.product.item_code : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilterStockList(newData);
            setSearch(text);
        } else {
            setFilterStockList(stockList);
            setSearch(text);
        }
    };


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

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                Snackbar.show({ text: 'Error Occurred', duration: Snackbar.LENGTH_SHORT })
            }
            return false;
        } else return true;
    };

    const handleCameraSelection = async () => {

        let options = {
            mediaType: 'photo',
            saveToPhotos: true,
            includeBase64: true,
        };
        // let isCameraPermitted = await requestCameraPermission();
        // let isStoragePermitted = await requestExternalWritePermission();
        // if (isCameraPermitted && isStoragePermitted) {
            launchCamera(options, (response) => {
                if (response.didCancel) {
                    Snackbar.show({ text: 'No Image Captured', duration: Snackbar.LENGTH_SHORT })
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    Snackbar.show({ text: 'No Camera Available', duration: Snackbar.LENGTH_SHORT })
                    return;
                } else if (response.errorCode == 'permission') {
                    Snackbar.show({ text: 'Permission Error', duration: Snackbar.LENGTH_SHORT })
                    return;
                } else if (response.errorCode == 'others') {
                    Snackbar.show({ text: 'Error occured. Please try again.', duration: Snackbar.LENGTH_SHORT })
                    return;
                }
                console.log('uri Camera-> ', response.assets[0].uri);
                console.log('width Camera-> ', response.assets[0].width);
                console.log('height Camera-> ', response.assets[0].height);
                console.log('fileSize Camera-> ', response.assets[0].fileSize);
                console.log('type Camera-> ', response.assets[0].type);
                console.log('fileName Camera-> ', response.assets[0].fileName);
                setCameraPhoto(response.assets[0]);
                setCameraPhotoUri(response.assets[0].uri);
            });
        // }
    };

    const saveImage = () => {

        console.log("FromDate: " + moment(date).format("DD-MMM-YYYY") + " Shift: " + shiftSelected);

        if (shiftSelected == null || shiftSelected === "" || shiftSelected === "- Select -") {
            Snackbar.show({ text: 'Please select shift', duration: Snackbar.LENGTH_SHORT })
        }
        else if (cameraPhoto === "" || cameraPhotoUri === "") {
            Snackbar.show({ text: 'Please capture image.', duration: Snackbar.LENGTH_SHORT })
        } else {
            Alert.alert(
                'Save Image', 'Are you sure you want to upload this image?',
                [
                    { text: 'Cancel', onPress: () => Snackbar.show({ text: 'No Image Saved', duration: Snackbar.LENGTH_SHORT }) },
                    { text: 'OK', onPress: () => uploadDocumentsToDatabase(), },
                ], {
                cancelable: false,
            },
            );
        }
    }

    const uploadDocumentsToDatabase = () => {

        const formData = new FormData();

        formData.append('staffs_id', staffId);
        formData.append('date', moment(date).format("YYYY-MM-DD[T]HH:mm"))
        formData.append('shift', shiftSelected)
        formData.append("file", cameraPhoto)

        //uploadAllDocuments(formData);
    }

    const uploadAllDocuments = (formData) => {

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': '' + userToken,
                'Accept': 'application/json',
            },
            body: formData
        };

        fetch(`${API_BASE}/patientappointmentapplication/uploaddocuments`, requestOptions)
            .then(res => {
                if (res.ok) {
                    Snackbar.show({ text: 'Documents Uploaded Successfully', duration: Snackbar.LENGTH_SHORT })
                    clearFields();
                } else {
                    Snackbar.show({ text: 'Documents not uploaded. Please try again. ', duration: Snackbar.LENGTH_SHORT })
                    clearFields();
                }
            })
            .catch(error => {
                Snackbar.show({ text: 'Error occured while uploading. Please try again. ', duration: Snackbar.LENGTH_SHORT })
                console.log("error : " + error);
                clearFields();
            });
    }

    const clearFields = () => {
        setCameraPhoto("");
        setCameraPhotoUri("");
        setDate(new Date());
        setShiftFocus(false);
        setShiftValue(null);
        setShiftSelected("");
    }

    return (
        <View style={styles.container}>

            {loading ?

                <ActivityIndicator />

                :

                <ScrollView style={styles.container}>

                    <View>

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
                                <Text style={styles.textHeading}>Select Date</Text>
                                <View style={styles.contentSubViewStyleRow}>
                                    <Icon name="calendar" type="font-awesome" size={20} color="#044F87" onPress={showDatepicker} />
                                    <Text style={styles.textContent}>{moment(date).format("DD-MMM-YYYY")}</Text>
                                </View>
                            </View>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>Select Shift</Text>
                                <Dropdown
                                    style={[styles.dropdown, shiftFocus]}
                                    data={shift}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    itemTextStyle={styles.itemTextStyle}
                                    placeholder={(shiftFocus) ? '- Select Shift -' : '...'}
                                    value={shiftValue}
                                    onFocus={() => { setShiftFocus(true); }}
                                    onBlur={() => { setShiftFocus(true); }}
                                    onChange={item => {
                                        setShiftValue(item.value);
                                        setShiftFocus(false);
                                        setShiftSelected(item.label);
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flexDirection: "row", margin: 5 }}>

                            <View>
                                <TouchableHighlight onPress={() => { handleCameraSelection() }} style={styles.touchableOpacityPhoto}  underlayColor={Colors.primaryLight2}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Icon name="camera" type="font-awesome" size={12} color={Colors.primary} />
                                        <Text style={styles.buttonTextPhoto}>Take Photo</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>

                            {cameraPhotoUri ?
                                <View style={{ borderWidth: 1, borderColor: Colors.primary, borderRadius: 5, padding: 5, margin: 5, flex: 1 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <View>
                                            <TouchableHighlight onPress={() => { navigation.navigate("View Image File", { file: cameraPhotoUri }) }}>
                                                <Image style={{ width: 75, height: 75 }} source={{ uri: cameraPhotoUri }} />
                                            </TouchableHighlight>
                                        </View>
                                        <TouchableOpacity onPress={() => { setCameraPhoto(); setCameraPhotoUri(); }}>
                                            <Icon name="cross" type="entypo" size={25} color="#F87171" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                : null}

                        </View>

                        {cameraPhotoUri ?
                            <View style={{ alignItems: "center" }}>
                                <TouchableHighlight onPress={() => { saveImage() }} style={styles.touchableOpacity}>
                                    <Text style={styles.buttonText}>Save & Verify</Text>
                                </TouchableHighlight>
                            </View>
                            : null}

                        <View>

                            <View style={styles.itemContentHeading}>
                                <Text style={{ flex: 0.5, fontWeight: "bold", color: Colors.black, fontSize: FontSize.smallMedium, }} >#</Text>
                                <Text style={{ flex: 3, fontWeight: "bold", color: Colors.black, fontSize: FontSize.smallMedium, }} >Item Name</Text>
                                <Text style={{ flex: 1.5, fontWeight: "bold", color: Colors.black, fontSize: FontSize.smallMedium, }} >Item Code</Text>
                                <Text style={{ flex: 1.25, fontWeight: "bold", color: Colors.black, fontSize: FontSize.smallMedium, }} >Total Stock</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ width: '100%' }} horizontal={true}>
                                <FlatList
                                    data={filterStockList}
                                    keyExtractor={(item, index) => { return index.toString(); }}
                                    renderItem={({ item, index }) => <StoreStockListItem item={item} index={index} />}
                                    showsHorizontalScrollIndicator={false}
                                    ListEmptyComponent={<NoDataFound />}
                                />
                            </ScrollView>

                        </View>

                    </View>

                </ScrollView>
            }

        </View>
    )
}

EmergencyInventory.propTypes = {
    navigation: PropTypes.object.isRequired,
};


export default EmergencyInventory

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    contentViewStyleRow: {
        flexDirection: "row",
        padding: 5,
    },
    contentSubViewStyleRow: {
        flexDirection: "row",
        alignItems: "center",
        height: 45,
        borderWidth: 0.5,
        borderRadius: 5,
        paddingHorizontal: 10,
        borderColor: Colors.lightGrey
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
    touchableOpacityPhoto: {
        width: 100,
        backgroundColor: Colors.white,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        padding: 10,
        margin: 5
    },
    touchableOpacity: {
        width: 150,
        backgroundColor: Colors.primary,
        margin: 10,
        borderRadius: 50,
        padding: 12,
    },
    buttonTextPhoto: {
        color: Colors.primary,
        textAlign: "center",
        fontSize: FontSize.small,
        fontFamily: Fonts.semiBold,
        marginStart: 5
    },
    buttonText: {
        color: Colors.white,
        textAlign: "center",
        fontSize: FontSize.smallMedium,
        fontFamily: Fonts.bold,
    },
    dropdown: {
        height: 45,
        borderWidth: 0.5,
        borderRadius: 5,
        paddingHorizontal: 10,
        borderColor: Colors.lightGrey
    },
    placeholderStyle: {
        fontSize: FontSize.smallMedium,
        fontFamily: Fonts.regular,
        color: Colors.lightGrey,
    },
    selectedTextStyle: {
        fontSize: FontSize.smallMedium,
        fontFamily: Fonts.semiBold,
        color: Colors.black,
    },
    itemTextStyle: {
        fontSize: FontSize.smallMedium,
        fontFamily: Fonts.regular,
        color: Colors.darkGrey,
    },

});