import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Keyboard, TouchableHighlight, Image, FlatList, Alert } from 'react-native'
import { Colors, FontSize, Fonts } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import moment from 'moment';
import PropTypes from 'prop-types';
import { API_BASE } from '../setupProxy';
import Snackbar from 'react-native-snackbar';
import { CheckBox, Icon } from 'react-native-elements';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { launchCamera } from 'react-native-image-picker';
import NoDataFound from '../common/NoDataFound';

const ComplainDetails = ({ navigation, route }) => {

    const { workDetailsItem, staffId, functionGetWork } = route.params;

    const [loading, setLoading] = useState(true);
    const [workDetails, setWorkDetails] = useState([]);

    const [selectedAmc, setSelectedAmc] = useState(null);
    const [selectedAmcNo, setSelectedAmcNo] = useState(null);
    const [selectedTouchup, setSelectedTouchup] = useState(null);
    const [touchupNotRequired, setTouchupNotRequired] = useState("Not Required");
    const [selectedSandFill, setSelectedSandFill] = useState(null);
    const [sandFillNotRequired, setSandFillNotRequired] = useState("Not Required");
    const [selectedMmt, setSelectedMmt] = useState(null);
    const [mmtNotRequired, setMmtNotRequired] = useState("Not Required");

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [remarks, setRemarks] = useState("");

    const [amcCameraPhoto, setAmcCameraPhoto] = useState(null);
    const [amcCameraPhotoUri, setAmcCameraPhotoUri] = useState("");
    const [amcImageList, setAmcImageList] = useState([]);
    const [amcShowDetails, setAmcShowDetails] = useState(false);

    const [touchupCameraPhoto, setTouchupCameraPhoto] = useState(null);
    const [touchupCameraPhotoUri, setTouchupCameraPhotoUri] = useState("");
    const [touchupImageList, setTouchupImageList] = useState([]);
    const [touchupShowDetails, setTouchupShowDetails] = useState(false);

    const [sandFillCameraPhoto, setSandFillCameraPhoto] = useState(null);
    const [sandFillCameraPhotoUri, setSandFillCameraPhotoUri] = useState("");
    const [sandFillImageList, setSandFillImageList] = useState([]);
    const [sandFillShowDetails, setSandFillShowDetails] = useState(false);

    const [mmtCameraPhoto, setMmtCameraPhoto] = useState(null);
    const [mmtCameraPhotoUri, setMmtCameraPhotoUri] = useState("");
    const [mmtImageList, setMmtImageList] = useState([]);
    const [mmtShowDetails, setMmtShowDetails] = useState(false);

    const [rubberTubeChecked, setRubberTubeChecked] = useState(false);
    const [rtClampChecked, setRtClampChecked] = useState(false);
    const [oldRubberTubeReceived, setOldRubberTubeReceived] = useState(false);
    const [oldRtClampReceived, setOldRtClampReceived] = useState(false);

    const getAmcAttachments = async () => {

        let toInput = {
            works_id: item.works_id,
        };

        await fetch(`https://shrikarniinfra.in/app/work/photolist`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        }).then((response) => response.json())
            .then((response) => {
                if (response.model) {
                    setAmcImageList(response.model);
                }
            }).catch((error) => {
                console.error('AMC GET ATTACHMENTS There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
            })
    }

    const getTouchupAttachments = async () => {

        let toInput = {
            works_id: item.works_id,
        };

        await fetch(`https://shrikarniinfra.in/app/work/photolist`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        }).then((response) => response.json())
            .then((response) => {
                if (response.model) {
                    setTouchupImageList(response.model);
                }
            }).catch((error) => {
                console.error('TOUCHUP GET ATTACHMENTS There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
            })
    }

    const getSandFillAttachments = async () => {

        let toInput = {
            works_id: item.works_id,
        };

        await fetch(`https://shrikarniinfra.in/app/work/photolist`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        }).then((response) => response.json())
            .then((response) => {
                if (response.model) {
                    setSandFillImageList(response.model);
                }
            }).catch((error) => {
                console.error('TOUCHUP GET ATTACHMENTS There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
            })
    }

    const getMmtAttachments = async () => {

        let toInput = {
            works_id: item.works_id,
        };

        await fetch(`https://shrikarniinfra.in/app/work/photolist`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        }).then((response) => response.json())
            .then((response) => {
                if (response.model) {
                    setMmtImageList(response.model);
                }
            }).catch((error) => {
                console.error('TOUCHUP GET ATTACHMENTS There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
            })
    }

    const handleCameraSelection = async (type) => {

        console.log("Camera Selection Type: " + type);

        let options = {
            mediaType: 'photo',
            saveToPhotos: true,
            includeBase64: true,
        };

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
            // console.log('uri Camera-> ', response.assets[0].uri);
            // console.log('width Camera-> ', response.assets[0].width);
            // console.log('height Camera-> ', response.assets[0].height);
            // console.log('fileSize Camera-> ', response.assets[0].fileSize);
            // console.log('type Camera-> ', response.assets[0].type);
            // console.log('fileName Camera-> ', response.assets[0].fileName);

            if (type === "amc") {
                setAmcCameraPhoto(response.assets[0]);
                setAmcCameraPhotoUri(response.assets[0].uri);
            } else if (type == "touchup") {
                setTouchupCameraPhoto(response.assets[0]);
                setTouchupCameraPhotoUri(response.assets[0].uri);
            } else if (type == "sandfill") {
                setSandFillCameraPhoto(response.assets[0]);
                setSandFillCameraPhotoUri(response.assets[0].uri);
            } else if (type == "mmt") {
                setMmtCameraPhoto(response.assets[0]);
                setMmtCameraPhotoUri(response.assets[0].uri);
            }

        });
    };

    const saveImage = (type) => {

        console.log("Save Image Type: " + type);

        Alert.alert(
            'Save Image', 'Are you sure you want to upload this image?',
            [
                { text: 'Cancel', onPress: () => Snackbar.show({ text: 'No Image Saved', duration: Snackbar.LENGTH_SHORT }) },
                { text: 'OK', onPress: () => { uploadDocumentsToDatabase(type) } },
            ], {
            cancelable: false,
        },
        );

    }

    const uploadDocumentsToDatabase = async (type) => {

        console.log("check: " + staffId + " " + item.works_id + " " + remarks);

        let formData = new FormData();

        if (type === "amc") {
            formData.append('image', {
                uri: amcCameraPhoto.uri,
                type: amcCameraPhoto.type,
                name: amcCameraPhoto.fileName,
                size: amcCameraPhoto.fileSize,
            });
        } else if (type == "touchup") {
            formData.append('image', {
                uri: touchupCameraPhoto.uri,
                type: touchupCameraPhoto.type,
                name: touchupCameraPhoto.fileName,
                size: touchupCameraPhoto.fileSize,
            });
        } else if (type == "sandfill") {
            formData.append('image', {
                uri: sandFillCameraPhoto.uri,
                type: sandFillCameraPhoto.type,
                name: sandFillCameraPhoto.fileName,
                size: amcCasandFillCameraPhotomeraPhoto.fileSize,
            });
        } else if (type == "mmt") {
            formData.append('image', {
                uri: mmtCameraPhoto.uri,
                type: mmtCameraPhoto.type,
                name: mmtCameraPhoto.fileName,
                size: mmtCameraPhoto.fileSize,
            });
        }

        formData.append('staffs_id', staffId);
        formData.append('works_id', item.works_id);
        formData.append('remarks', remarks)

        const requestOptions = {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'content-type': 'multipart/form-data',
            },
        };

        fetch(`${API_BASE}/app/work/workphoto`, requestOptions)
            .then(res => {
                console.log("resp: " + JSON.stringify(res));
                if (res.ok) {
                    clearData(type);

                } else {
                    Snackbar.show({ text: 'Not Uploaded. Please try again. ', duration: Snackbar.LENGTH_SHORT })
                }
            })
            .catch(error => {
                Snackbar.show({ text: 'Error occured while uploading. Please try again. ', duration: Snackbar.LENGTH_SHORT })
                console.log("error : " + error);
                setAmcCameraPhoto(null);
                setAmcCameraPhotoUri("");
            });

    }

    const clearData = (type) => {
        if (type === "amc") {
            setAmcCameraPhoto(null);
            setAmcCameraPhotoUri("");
            getAmcAttachments();
        } else if (type == "touchup") {
            setTouchupCameraPhoto(null);
            setTouchupCameraPhotoUri("");
            getTouchupAttachments();
        } else if (type == "sandfill") {
            setSandFillCameraPhoto(null);
            setSandFillCameraPhotoUri("");
            getSandFillAttachments();
        } else if (type == "mmt") {
            setMmtCameraPhoto(null);
            setMmtCameraPhotoUri("");
            getMmtAttachments();
        }
    }

    useEffect(() => {

        getWorkDetails();

    }, []);

    const getWorkDetails = async () => {
        if (workDetailsItem !== null || workDetailsItem !== "") {
            setLoading(false);
            setWorkDetails(workDetailsItem);
        }
        setRemarks(workDetailsItem.remarks2);
    }

    const saveData = async () => {
        if (Keyboard.isVisible) {
            Keyboard.dismiss();
        }

        console.log(
            " staffs_id: " + staffId +
            " worksid: " + workDetailsItem.id +
            " worktype: " + "dprs" +
            " remarks: " + remarks
        );


        setLoading(true);

        let toInput = {
            worksid: workDetailsItem.id,
            worktype: "dprs",
            staffs_id: staffId,
            remarks: remarks
        };

        await fetch(`${API_BASE}/app/work/updatework`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        })
            .then((response) => response.json())
            .then((response) => {

                setLoading(false);

                if (response.code == 1) {
                    functionGetWork(staffId);
                    Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT });
                } else {
                    Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT });
                }

            })
            .catch((error) => {
                setLoading(false);
                console.error('WORK DETAILS DPRS There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
            })


    }

    const onStartTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime;
        setStartTime(currentTime);
    };

    const showStartTimepicker = () => {
        DateTimePickerAndroid.open({
            value: startTime,
            onChange: onStartTimeChange,
            mode: 'time',
            is24Hour: false,
            display: "default",
        });
    };

    const onEndTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime;
        setEndTime(currentTime);
    };

    const showEndTimepicker = () => {
        DateTimePickerAndroid.open({
            value: endTime,
            onChange: onEndTimeChange,
            mode: 'time',
            is24Hour: false,
            display: "default",
        });
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView keyboardShouldPersistTaps='handled' >

                {loading ?
                    <ActivityIndicator />
                    :
                    <View style={{ marginBottom: 10 }}>

                        <View style={styles.itemContainer}>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Customer Name:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.name ? workDetails.name : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>House No./City:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.houseno ? workDetails.houseno + ", " : ""} {workDetails.city ? workDetails.city : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Description:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.description ? workDetails.description : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Notification Dt.:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.notificationdate ? moment(workDetails.notificationdate).format("DD-MMM-YYYY") : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Notification Type:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.notificationtype ? workDetails.notificationtype : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Segment:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.segment ? workDetails.segment : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>SLA:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.sla ? workDetails.sla : ""}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.itemContainer1}>
                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>AMC Done</Text>
                                <View style={styles.outerView}>
                                    <View style={{ flex: 1 }} >
                                        <CheckBox
                                            checked={selectedAmc == 0}
                                            onPress={() => setSelectedAmc(0)}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="Yes"
                                        />
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <CheckBox
                                            checked={selectedAmc == 1}
                                            onPress={() => setSelectedAmc(1)}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="No"
                                        />
                                    </View>
                                </View>
                                {selectedAmc == 0 ?
                                    <View style={styles.itemContainer1}>
                                        <Text style={styles.textHeading}>Images</Text>
                                        <View style={{ flexDirection: "row" }}>

                                            <TouchableHighlight onPress={() => { setAmcShowDetails(!amcShowDetails); getAmcAttachments(); }} style={styles.touchableOpacityImages} underlayColor={Colors.primaryLight2}>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Icon name="image" type="font-awesome" size={12} color={Colors.primary} />
                                                    <Text style={styles.buttonTextPhoto}>View Images</Text>
                                                </View>
                                            </TouchableHighlight>

                                            <TouchableHighlight onPress={() => { setAmcShowDetails(!amcShowDetails); handleCameraSelection("amc"); }} style={styles.touchableOpacityPhoto} underlayColor={Colors.primaryLight2}>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Icon name="camera" type="font-awesome" size={12} color={Colors.primary} />
                                                    <Text style={styles.buttonTextPhoto}>Take Photo</Text>
                                                </View>
                                            </TouchableHighlight>

                                        </View>

                                        {amcShowDetails ?
                                            <FlatList
                                                data={amcImageList}
                                                ListEmptyComponent={<NoDataFound />}
                                                renderItem={({ item, index }) => (
                                                    <View>
                                                        <TouchableHighlight onPress={() => { navigation.navigate("View Image File", { file: `https://shrikarniinfra.in/uploads/works/${item.image}` }) }}>
                                                            <Image style={styles.imageStyle} source={{ uri: `https://shrikarniinfra.in/uploads/works/${item.image}` }} />
                                                        </TouchableHighlight>
                                                    </View>
                                                )}
                                            />
                                            : null
                                        }

                                        {amcCameraPhotoUri ?
                                            <View style={styles.imageContent}>
                                                <View>
                                                    <TouchableHighlight onPress={() => { navigation.navigate("View Image File", { file: amcCameraPhotoUri }) }}>
                                                        <Image style={styles.imageStyle} source={{ uri: amcCameraPhotoUri }} />
                                                    </TouchableHighlight>
                                                </View>
                                                <TouchableOpacity onPress={() => { setAmcCameraPhoto(null); setAmcCameraPhotoUri(""); }}>
                                                    <Icon name="cross" type="entypo" size={25} color="#F87171" />
                                                </TouchableOpacity>
                                            </View>
                                            : null
                                        }
                                        <View style={styles.outerView}>
                                            <View style={styles.innerView} >
                                                {amcCameraPhotoUri ?
                                                    <TouchableHighlight onPress={() => { saveImage("amc") }} style={styles.touchableOpacitySave}>
                                                        <Text style={styles.buttonTextSave}>Save</Text>
                                                    </TouchableHighlight>
                                                    : null}
                                            </View>
                                        </View>

                                    </View>
                                    :
                                    <View>
                                        {selectedAmc == 1 ?
                                            <View style={styles.itemContainer1}>
                                                <Text style={styles.textHeading}>Remarks</Text>
                                                <View style={{ flex: 1 }} >
                                                    <CheckBox
                                                        checked={selectedAmcNo == 0}
                                                        onPress={() => setSelectedAmcNo(0)}
                                                        checkedIcon="dot-circle-o"
                                                        uncheckedIcon="circle-o"
                                                        checkedColor={Colors.primary}
                                                        uncheckedColor={Colors.lightGrey}
                                                        title="House Closed"
                                                    />
                                                </View>
                                                <View style={{ flex: 1 }} >
                                                    <CheckBox
                                                        checked={selectedAmcNo == 1}
                                                        onPress={() => setSelectedAmcNo(1)}
                                                        checkedIcon="dot-circle-o"
                                                        uncheckedIcon="circle-o"
                                                        checkedColor={Colors.primary}
                                                        uncheckedColor={Colors.lightGrey}
                                                        title="Not Agree"
                                                    />
                                                </View>
                                            </View>
                                            :
                                            null
                                        }
                                    </View>
                                }

                            </View>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>Touch Up Done</Text>
                                <View style={styles.outerView}>
                                    <View style={{ flex: 1 }} >
                                        <CheckBox
                                            checked={selectedTouchup == 0}
                                            onPress={() => setSelectedTouchup(0)}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="Yes"
                                        />
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <CheckBox
                                            checked={selectedTouchup == 1}
                                            onPress={() => setSelectedTouchup(1)}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="No"
                                        />
                                    </View>
                                </View>
                                {selectedTouchup == 0 ?
                                    <View style={styles.itemContainer1}>
                                        <Text style={styles.textHeading}>Images</Text>
                                        <View style={{ flexDirection: "row" }}>

                                            <TouchableHighlight onPress={() => { setTouchupShowDetails(!touchupShowDetails); getTouchupAttachments(); }} style={styles.touchableOpacityImages} underlayColor={Colors.primaryLight2}>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Icon name="image" type="font-awesome" size={12} color={Colors.primary} />
                                                    <Text style={styles.buttonTextPhoto}>View Images</Text>
                                                </View>
                                            </TouchableHighlight>

                                            <TouchableHighlight onPress={() => { setTouchupShowDetails(!touchupShowDetails); handleCameraSelection("touchup"); }} style={styles.touchableOpacityPhoto} underlayColor={Colors.primaryLight2}>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Icon name="camera" type="font-awesome" size={12} color={Colors.primary} />
                                                    <Text style={styles.buttonTextPhoto}>Take Photo</Text>
                                                </View>
                                            </TouchableHighlight>

                                        </View>

                                        {touchupShowDetails ?
                                            <FlatList
                                                data={touchupImageList}
                                                ListEmptyComponent={<NoDataFound />}
                                                renderItem={({ item, index }) => (
                                                    <View>
                                                        <TouchableHighlight onPress={() => { navigation.navigate("View Image File", { file: `https://shrikarniinfra.in/uploads/works/${item.image}` }) }}>
                                                            <Image style={styles.imageStyle} source={{ uri: `https://shrikarniinfra.in/uploads/works/${item.image}` }} />
                                                        </TouchableHighlight>
                                                    </View>
                                                )}
                                            />
                                            : null
                                        }

                                        {touchupCameraPhotoUri ?
                                            <View style={styles.imageContent}>
                                                <View>
                                                    <TouchableHighlight onPress={() => { navigation.navigate("View Image File", { file: touchupCameraPhotoUri }) }}>
                                                        <Image style={styles.imageStyle} source={{ uri: touchupCameraPhotoUri }} />
                                                    </TouchableHighlight>
                                                </View>
                                                <TouchableOpacity onPress={() => { setTouchupCameraPhoto(null); setTouchupCameraPhotoUri(""); }}>
                                                    <Icon name="cross" type="entypo" size={25} color="#F87171" />
                                                </TouchableOpacity>
                                            </View>
                                            : null
                                        }
                                        <View style={styles.outerView}>
                                            <View style={styles.innerView} >
                                                {touchupCameraPhotoUri ?
                                                    <TouchableHighlight onPress={() => { saveImage("touchup") }} style={styles.touchableOpacitySave}>
                                                        <Text style={styles.buttonTextSave}>Save</Text>
                                                    </TouchableHighlight>
                                                    : null}
                                            </View>
                                        </View>

                                    </View>
                                    :
                                    <View>
                                        {selectedTouchup == 1 ?
                                            <View style={styles.itemContainer1}>
                                                <Text style={styles.textHeading}>Remarks</Text>
                                                <View style={{ flex: 1 }} >
                                                    <TextInput style={styles.textContent} value={touchupNotRequired} onChangeText={(text) => setTouchupNotRequired(text)} />
                                                </View>
                                                <View style={styles.viewStyle} />
                                            </View>
                                            :
                                            null
                                        }
                                    </View>
                                }
                            </View>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>Sand Fill Done</Text>
                                <View style={styles.outerView}>
                                    <View style={{ flex: 1 }} >
                                        <CheckBox
                                            checked={selectedSandFill == 0}
                                            onPress={() => setSelectedSandFill(0)}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="Yes"
                                        />
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <CheckBox
                                            checked={selectedSandFill == 1}
                                            onPress={() => setSelectedSandFill(1)}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="No"
                                        />
                                    </View>
                                </View>
                                {selectedSandFill == 0 ?
                                    <View style={styles.itemContainer1}>
                                        <Text style={styles.textHeading}>Images</Text>
                                        <View style={{ flexDirection: "row" }}>

                                            <TouchableHighlight onPress={() => { setSandFillShowDetails(!sandFillShowDetails); getSandFillAttachments(); }} style={styles.touchableOpacityImages} underlayColor={Colors.primaryLight2}>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Icon name="image" type="font-awesome" size={12} color={Colors.primary} />
                                                    <Text style={styles.buttonTextPhoto}>View Images</Text>
                                                </View>
                                            </TouchableHighlight>

                                            <TouchableHighlight onPress={() => { setSandFillShowDetails(!sandFillShowDetails); handleCameraSelection("sandfill"); }} style={styles.touchableOpacityPhoto} underlayColor={Colors.primaryLight2}>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Icon name="camera" type="font-awesome" size={12} color={Colors.primary} />
                                                    <Text style={styles.buttonTextPhoto}>Take Photo</Text>
                                                </View>
                                            </TouchableHighlight>

                                        </View>

                                        {sandFillShowDetails ?
                                            <FlatList
                                                data={sandFillImageList}
                                                ListEmptyComponent={<NoDataFound />}
                                                renderItem={({ item, index }) => (
                                                    <View>
                                                        <TouchableHighlight onPress={() => { navigation.navigate("View Image File", { file: `https://shrikarniinfra.in/uploads/works/${item.image}` }) }}>
                                                            <Image style={styles.imageStyle} source={{ uri: `https://shrikarniinfra.in/uploads/works/${item.image}` }} />
                                                        </TouchableHighlight>
                                                    </View>
                                                )}
                                            />
                                            : null
                                        }

                                        {sandFillCameraPhotoUri ?
                                            <View style={styles.imageContent}>
                                                <View>
                                                    <TouchableHighlight onPress={() => { navigation.navigate("View Image File", { file: sandFillCameraPhotoUri }) }}>
                                                        <Image style={styles.imageStyle} source={{ uri: sandFillCameraPhotoUri }} />
                                                    </TouchableHighlight>
                                                </View>
                                                <TouchableOpacity onPress={() => { setSandFillCameraPhoto(null); setSandFillCameraPhotoUri(""); }}>
                                                    <Icon name="cross" type="entypo" size={25} color="#F87171" />
                                                </TouchableOpacity>
                                            </View>
                                            : null
                                        }
                                        <View style={styles.outerView}>
                                            <View style={styles.innerView} >
                                                {sandFillCameraPhotoUri ?
                                                    <TouchableHighlight onPress={() => { saveImage("sandfill") }} style={styles.touchableOpacitySave}>
                                                        <Text style={styles.buttonTextSave}>Save</Text>
                                                    </TouchableHighlight>
                                                    : null}
                                            </View>
                                        </View>

                                    </View>
                                    :
                                    <View>
                                        {selectedSandFill == 1 ?
                                            <View style={styles.itemContainer1}>
                                                <Text style={styles.textHeading}>Remarks</Text>
                                                <View style={{ flex: 1 }} >
                                                    <TextInput style={styles.textContent} value={sandFillNotRequired} onChangeText={(text) => setSandFillNotRequired(text)} />
                                                </View>
                                                <View style={styles.viewStyle} />
                                            </View>
                                            :
                                            null
                                        }
                                    </View>
                                }
                            </View>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>MMT Done</Text>
                                <View style={styles.outerView}>
                                    <View style={{ flex: 1 }} >
                                        <CheckBox
                                            checked={selectedMmt == 0}
                                            onPress={() => setSelectedMmt(0)}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="Yes"
                                        />
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <CheckBox
                                            checked={selectedMmt == 1}
                                            onPress={() => setSelectedMmt(1)}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="No"
                                        />
                                    </View>
                                </View>
                                {selectedMmt == 0 ?
                                    <View style={styles.itemContainer1}>
                                        <Text style={styles.textHeading}>Images</Text>
                                        <View style={{ flexDirection: "row" }}>

                                            <TouchableHighlight onPress={() => { setMmtShowDetails(!mmtShowDetails); getMmtAttachments(); }} style={styles.touchableOpacityImages} underlayColor={Colors.primaryLight2}>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Icon name="image" type="font-awesome" size={12} color={Colors.primary} />
                                                    <Text style={styles.buttonTextPhoto}>View Images</Text>
                                                </View>
                                            </TouchableHighlight>

                                            <TouchableHighlight onPress={() => { setMmtShowDetails(!mmtShowDetails); handleCameraSelection("mmt"); }} style={styles.touchableOpacityPhoto} underlayColor={Colors.primaryLight2}>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Icon name="camera" type="font-awesome" size={12} color={Colors.primary} />
                                                    <Text style={styles.buttonTextPhoto}>Take Photo</Text>
                                                </View>
                                            </TouchableHighlight>

                                        </View>

                                        {mmtShowDetails ?
                                            <FlatList
                                                data={mmtImageList}
                                                ListEmptyComponent={<NoDataFound />}
                                                renderItem={({ item, index }) => (
                                                    <View>
                                                        <TouchableHighlight onPress={() => { navigation.navigate("View Image File", { file: `https://shrikarniinfra.in/uploads/works/${item.image}` }) }}>
                                                            <Image style={styles.imageStyle} source={{ uri: `https://shrikarniinfra.in/uploads/works/${item.image}` }} />
                                                        </TouchableHighlight>
                                                    </View>
                                                )}
                                            />
                                            : null
                                        }

                                        {mmtCameraPhotoUri ?
                                            <View style={styles.imageContent}>
                                                <View>
                                                    <TouchableHighlight onPress={() => { navigation.navigate("View Image File", { file: mmtCameraPhotoUri }) }}>
                                                        <Image style={styles.imageStyle} source={{ uri: mmtCameraPhotoUri }} />
                                                    </TouchableHighlight>
                                                </View>
                                                <TouchableOpacity onPress={() => { setMmtCameraPhoto(null); setMmtCameraPhotoUri(""); }}>
                                                    <Icon name="cross" type="entypo" size={25} color="#F87171" />
                                                </TouchableOpacity>
                                            </View>
                                            : null
                                        }
                                        <View style={styles.outerView}>
                                            <View style={styles.innerView} >
                                                {mmtCameraPhotoUri ?
                                                    <TouchableHighlight onPress={() => { saveImage("mmt") }} style={styles.touchableOpacitySave}>
                                                        <Text style={styles.buttonTextSave}>Save</Text>
                                                    </TouchableHighlight>
                                                    : null}
                                            </View>
                                        </View>

                                    </View>
                                    :
                                    <View>
                                        {selectedMmt == 1 ?
                                            <View style={styles.itemContainer1}>
                                                <Text style={styles.textHeading}>Remarks</Text>
                                                <View style={{ flex: 1 }} >
                                                    <TextInput style={styles.textContent} value={mmtNotRequired} onChangeText={(text) => setMmtNotRequired(text)} />
                                                </View>
                                                <View style={styles.viewStyle} />
                                            </View>
                                            :
                                            null
                                        }
                                    </View>
                                }
                            </View>

                            <View style={styles.contentViewStyle}>
                                <View style={styles.outerView}>
                                    <View style={{ flex: 1 }} >
                                        <Text style={styles.textHeading}>Start Time</Text>
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <Text style={styles.textHeading}>End Time</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.contentViewStyle}>
                                <View style={styles.outerView}>
                                    <View style={{ flex: 1 }} >
                                        <View style={styles.contentSubViewStyleRow}>
                                            <View style={{ marginEnd: 10 }}>
                                                <Icon name="schedule" type="material-icon" size={20} color="#044F87" onPress={showStartTimepicker} />
                                            </View>
                                            <Text style={styles.textContent}>{moment(startTime).format("HH:mm A")}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <View style={styles.contentSubViewStyleRow}>
                                            <View style={{ marginEnd: 10 }}>
                                                <Icon name="schedule" type="material-icon" size={20} color="#044F87" onPress={showEndTimepicker} />
                                            </View>
                                            <Text style={styles.textContent}>{moment(endTime).format("HH:mm A")}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.viewStyle} />
                            </View>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>Remarks</Text>
                                <TextInput style={styles.textContent} value={remarks} onChangeText={(remarks) => setRemarks(remarks)} />
                                <View style={styles.viewStyle} />
                            </View>

                            <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Material Used</Text>
                            <CheckBox
                                checked={rubberTubeChecked}
                                onPress={() => { setRubberTubeChecked(!rubberTubeChecked); }}
                                iconType="material-community"
                                checkedIcon="checkbox-outline"
                                uncheckedIcon={'checkbox-blank-outline'}
                                title="Rubber Tube"
                                checkedColor={Colors.primary}
                            />
                            <CheckBox
                                checked={rtClampChecked}
                                onPress={() => { setRtClampChecked(!rtClampChecked); }}
                                iconType="material-community"
                                checkedIcon="checkbox-outline"
                                uncheckedIcon={'checkbox-blank-outline'}
                                title="RT Clamp"
                                checkedColor={Colors.primary}
                            />
                        </View>

                        <View style={styles.contentViewStyle}>
                            <Text style={styles.textHeading}>Material Return</Text>
                            <CheckBox
                                checked={oldRubberTubeReceived}
                                onPress={() => { setOldRubberTubeReceived(!oldRubberTubeReceived); }}
                                iconType="material-community"
                                checkedIcon="checkbox-outline"
                                uncheckedIcon={'checkbox-blank-outline'}
                                title="Old Rubber Tube Received"
                                checkedColor={Colors.primary}
                            />
                            <CheckBox
                                checked={oldRtClampReceived}
                                onPress={() => { setOldRtClampReceived(!oldRtClampReceived); }}
                                iconType="material-community"
                                checkedIcon="checkbox-outline"
                                uncheckedIcon={'checkbox-blank-outline'}
                                title="Old RT Clamp Received"
                                checkedColor={Colors.primary}
                            />
                        </View>


                        </View>

                        <View style={{ padding: 20 }}>
                            <TouchableOpacity style={styles.touchableOpacity} onPress={() => { saveData() }}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                }

            </ScrollView >

        </KeyboardAvoidingView>
    )
}

ComplainDetails.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
};

export default ComplainDetails

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
        padding: 10
    },
    contentViewStyleRow: {
        flex: 1,
        flexDirection: "row",
    },
    contentViewStyle: {
        margin: 5,
        flex: 1
    },
    textHeading: {
        color: Colors.lightGrey,
    },
    textContent: {
        color: Colors.black,
        paddingTop: 10,
        paddingBottom: 5,
    },
    viewStyle: {
        backgroundColor: Colors.grey,
        height: 2,
    },
    touchableOpacity: {
        backgroundColor: Colors.primary,
        marginTop: 10,
        marginBottom: 15,
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
    contentSubViewStyleRow: {
        flexDirection: "row",
        alignItems: "center",
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
    listViewStyle: {
        borderWidth: 0.5,
        borderColor: Colors.lightGrey,
        padding: 5,
        position: "relative",
        backgroundColor: "white"
    },
    textIconView: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    textInputStyle: {
        color: Colors.black,
        flex: 1
    },
    itemContainer: {
        borderRadius: 5,
        backgroundColor: Colors.grey,
        shadowColor: Colors.darkGrey,
        elevation: 10,
        padding: 10,
        marginVertical: 5,
        borderWidth: 0.5,
        borderColor: Colors.primary,
    },
    itemContainer1: {
        borderRadius: 5,
        backgroundColor: Colors.white,
        shadowColor: Colors.darkGrey,
        elevation: 5,
        padding: 10,
        marginVertical: 5,
        borderWidth: 0.5,
        borderColor: Colors.primary,
    },
    outerView: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    innerHeadingView: {
        flex: 1,
        alignSelf: 'stretch',
    },
    innerView: {
        flex: 2,
        alignSelf: 'stretch',
    },
    itemTextHeading: {
        color: Colors.black,
        fontFamily: Fonts.bold,
        fontWeight: "bold",
    },
    itemTextContent: {
        color: Colors.black,
        fontFamily: Fonts.regular,
    },
    touchableOpacityImages: {
        width: 110,
        marginVertical: 2,
        marginHorizontal: 5,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        padding: 5,
    },
    touchableOpacitySave: {
        width: 75,
        backgroundColor: Colors.primary,
        borderRadius: 50,
        padding: 8,
    },
    touchableOpacityPhoto: {
        width: 100,
        marginVertical: 2,
        marginHorizontal: 5,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        padding: 5,
    },
    buttonTextSave: {
        color: Colors.white,
        textAlign: "center",
        fontFamily: Fonts.bold,
    },
    buttonTextPhoto: {
        color: Colors.primary,
        textAlign: "center",
        fontFamily: Fonts.semiBold,
        marginStart: 5
    },
    imageContent: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 5,
        padding: 5,
        marginVertical: 5,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    imageStyle: {
        width: 75,
        height: 75,
        resizeMode: 'contain',
        margin: 5,
        backgroundColor: Colors.white,
        flexDirection: "row",
        justifyContent: "space-between"
    }
});