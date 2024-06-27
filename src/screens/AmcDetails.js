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
import { Dropdown } from 'react-native-element-dropdown';

const List = [
    { id: 1, status: "Completed" },
    { id: 2, status: "Pending" },
]

const AmcDetails = ({ navigation, route }) => {

    const { workDetailsItem, staffId, functionGetWork } = route.params;

    const [loading, setLoading] = useState(true);
    const [workDetails, setWorkDetails] = useState([]);

    const [selectedAmc, setSelectedAmc] = useState("");
    const [selectedAmcNo, setSelectedAmcNo] = useState("");
    const [selectedTouchup, setSelectedTouchup] = useState("");
    const [touchupNotRequired, setTouchupNotRequired] = useState("Not Required");
    const [selectedSandFill, setSelectedSandFill] = useState("");
    const [sandFillNotRequired, setSandFillNotRequired] = useState("Not Required");
    const [selectedMmt, setSelectedMmt] = useState("");
    const [mmtNotRequired, setMmtNotRequired] = useState("Not Required");

    const [startTime, setStartTime] = useState(new Date(moment()));
    const [endTime, setEndTime] = useState(new Date(moment()));
    const [remarks, setRemarks] = useState("");

    const [amcCameraPhoto, setAmcCameraPhoto] = useState(null);
    const [amcCameraPhotoUri, setAmcCameraPhotoUri] = useState("");
    const [amcImageList, setAmcImageList] = useState([]);
    const [amcShowDetails, setAmcShowDetails] = useState(false);

    const [touchupCameraPhoto, setTouchupCameraPhoto] = useState(null);
    const [touchupCameraPhotoUri, setTouchupCameraPhotoUri] = useState("");
    const [touchupImageList, setTouchupImageList] = useState([]); ``
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

    const [statusList, setStatusList] = useState([]);
    const [statusValue, setStatusValue] = useState(null);
    const [statusFocus, setStatusFocus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");

    const getAllAttachments = async () => {

        let toInput = {
            works_id: workDetailsItem.works_id,
        };

        await fetch(`https://shrikarniinfra.in/app/work/photolist`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        }).then((response) => response.json())
            .then((response) => {
                console.log("Image: " + JSON.stringify(response.model));
                setAmcImageList(response.model.filter(item => {
                    return item.remarks === "AMC_AMC"
                }))
                setSandFillImageList(response.model.filter(item => {
                    return item.remarks === "AMC_SANDFILL"
                }))
                setTouchupImageList(response.model.filter(item => {
                    return item.remarks === "AMC_TOUCHUP"
                }))
                setMmtImageList(response.model.filter(item => {
                    return item.remarks === "AMC_MMT"
                }))
            }).catch((error) => {
                console.error('AMC GET ATTACHMENTS There was an error!', error);
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

        console.log("type: " + type + " " + staffId + " " + workDetailsItem.id);

        let formData = new FormData();

        if (type === "amc") {
            formData.append('image', {
                uri: amcCameraPhoto.uri,
                type: amcCameraPhoto.type,
                name: amcCameraPhoto.fileName,
                size: amcCameraPhoto.fileSize,
            });
            formData.append('remarks', "AMC_AMC")
        } else if (type == "touchup") {
            formData.append('image', {
                uri: touchupCameraPhoto.uri,
                type: touchupCameraPhoto.type,
                name: touchupCameraPhoto.fileName,
                size: touchupCameraPhoto.fileSize,
            });
            formData.append('remarks', "AMC_TOUCHUP")
        } else if (type == "sandfill") {
            formData.append('image', {
                uri: sandFillCameraPhoto.uri,
                type: sandFillCameraPhoto.type,
                name: sandFillCameraPhoto.fileName,
                size: sandFillCameraPhoto.fileSize,
            });
            formData.append('remarks', "AMC_SANDFILL")
        } else if (type == "mmt") {
            formData.append('image', {
                uri: mmtCameraPhoto.uri,
                type: mmtCameraPhoto.type,
                name: mmtCameraPhoto.fileName,
                size: mmtCameraPhoto.fileSize,
            });
            formData.append('remarks', "AMC_MMT")
        }

        formData.append('staffs_id', staffId);
        formData.append('works_id', workDetailsItem.works_id);

        const requestOptions = {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'content-type': 'multipart/form-data',
            },
        };

        console.log("req Options: " + JSON.stringify(requestOptions));

        await fetch(`${API_BASE}/app/work/workphoto`, requestOptions)
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
            });

    }

    const clearData = (type) => {
        getAllAttachments();
        if (type === "amc") {
            setAmcCameraPhoto(null);
            setAmcCameraPhotoUri("");
        } else if (type == "touchup") {
            setTouchupCameraPhoto(null);
            setTouchupCameraPhotoUri("");
        } else if (type == "sandfill") {
            setSandFillCameraPhoto(null);
            setSandFillCameraPhotoUri("");
        } else if (type == "mmt") {
            setMmtCameraPhoto(null);
            setMmtCameraPhotoUri("");
        }
    }

    useEffect(() => {

        getAllAttachments();
        getWorkDetails();
        setStatusList(List);

    }, []);

    const getWorkDetails = async () => {
        if (workDetailsItem !== null || workDetailsItem !== "") {
            setLoading(false);
            setWorkDetails(workDetailsItem);
            console.log("workAMCDetails: " + JSON.stringify(workDetailsItem));
        }

        setSelectedAmc(workDetailsItem.amcdone);
        setSelectedAmcNo(workDetailsItem.amcremarks);
        setSelectedSandFill(workDetailsItem.sandfilldone);
        setSandFillNotRequired(workDetailsItem.sandfillremarks);
        setSelectedTouchup(workDetailsItem.touchupdone);
        setTouchupNotRequired(workDetailsItem.touchupremarks);
        setSelectedMmt(workDetailsItem.mmtdone);
        setMmtNotRequired(workDetailsItem.mmtremarks);

        if (workDetailsItem.starttime == null) {
            setStartTime(new Date(moment()));
        } else {
            setStartTime(new Date(workDetailsItem.starttime));
        }

        if (workDetailsItem.starttime == null) {
            setEndTime(new Date(moment()));
        } else {
            setEndTime(new Date(workDetailsItem.endtime));
        }

        setRemarks(workDetailsItem.remarks);
        setStatusValue(workDetailsItem.staffworkstatus);
        setSelectedStatus(workDetailsItem.staffworkstatus);
        if (workDetailsItem.rubbertubeused === "Yes") {
            setRubberTubeChecked(true);
        } else {
            setRubberTubeChecked(false);
        }
        if (workDetailsItem.rtclamapused === "Yes") {
            setRtClampChecked(true);
        } else {
            setRtClampChecked(false);
        }
        if (workDetailsItem.oldrubbertubereturned === "Yes") {
            setOldRubberTubeReceived(true);
        } else {
            setOldRubberTubeReceived(false);
        }
        if (workDetailsItem.oldrtclapmreturned === "Yes") {
            setOldRtClampReceived(true);
        } else {
            setOldRtClampReceived(false);
        }
    }

    const saveData = async () => {
        if (Keyboard.isVisible) {
            Keyboard.dismiss();
        }

        let rubberTube, rtClamp, oldRubberTube, oldRtClamp;
        if (rubberTubeChecked) {
            rubberTube = "Yes";
        } else {
            rubberTube = "No";
        }

        if (rtClampChecked) {
            rtClamp = "Yes";
        } else {
            rtClamp = "No";
        }

        if (oldRubberTubeReceived) {
            oldRubberTube = "Yes";
        } else {
            oldRubberTube = "No";
        }

        if (oldRtClampReceived) {
            oldRtClamp = "Yes";
        } else {
            oldRtClamp = "No";
        }

        if (selectedAmc == "" || selectedTouchup == null) {
            Snackbar.show({ text: 'Please Select AMC', duration: Snackbar.LENGTH_SHORT });
        } else if (selectedAmc == "Yes" && amcImageList.length == 0) {
            setSelectedAmcNo(null);
            Snackbar.show({ text: 'Select & Upload Image for AMC', duration: Snackbar.LENGTH_SHORT });
        } else if (selectedAmc == "No" && (selectedAmcNo == null || selectedAmc == "undefined")) {
            Snackbar.show({ text: 'Please Select AMC Remarks', duration: Snackbar.LENGTH_SHORT });
        }
        else if (selectedSandFill == "" || selectedSandFill == null) {
            Snackbar.show({ text: 'Please Select Sandfill', duration: Snackbar.LENGTH_SHORT });
        } else if (selectedSandFill == "Yes" && sandFillImageList.length == 0) {
            setSandFillNotRequired(null);
            Snackbar.show({ text: 'Select & Upload Image for Sandfill', duration: Snackbar.LENGTH_SHORT });
        } else if (selectedSandFill == "No" && sandFillNotRequired == null) {
            Snackbar.show({ text: 'Please Enter Sandfill Remarks', duration: Snackbar.LENGTH_SHORT });
        }
        else if (selectedTouchup == "" || selectedTouchup == null) {
            Snackbar.show({ text: 'Please Select Touchup', duration: Snackbar.LENGTH_SHORT });
        } else if (selectedTouchup == "Yes" && touchupImageList.length == 0) {
            setTouchupNotRequired(null);
            Snackbar.show({ text: 'Select & Upload Image for Touchup', duration: Snackbar.LENGTH_SHORT });
        } else if (selectedTouchup == "No" && touchupNotRequired == null) {
            Snackbar.show({ text: 'Please Enter Touchup Remarks', duration: Snackbar.LENGTH_SHORT });
        }
        else if (selectedMmt == "" || selectedMmt == null) {
            Snackbar.show({ text: 'Please Select MMT', duration: Snackbar.LENGTH_SHORT });
        } else if (selectedMmt == "Yes" && mmtImageList.length == 0) {
            setMmtNotRequired(null);
            Snackbar.show({ text: 'Select & Upload Image for MMT', duration: Snackbar.LENGTH_SHORT });
        } else if (selectedMmt == "No" && mmtNotRequired == null) {
            Snackbar.show({ text: 'Please Enter MMT Remarks', duration: Snackbar.LENGTH_SHORT });
        }
        else if (remarks == "" || remarks == null) {
            Snackbar.show({ text: 'Please enter remarks', duration: Snackbar.LENGTH_SHORT });
        }
        else if (startTime.toString() === endTime.toString() || startTime.toString() > endTime.toString()) {
            Snackbar.show({ text: 'Please change start time or end time ', duration: Snackbar.LENGTH_SHORT });
        } else {
            
            let toInput = {
                worksid: workDetailsItem.id,
                staffs_id: staffId,
                amcdone: selectedAmc,
                amcremarks: selectedAmcNo,
                sandfilldone: selectedSandFill,
                sandfillremarks: sandFillNotRequired,
                mmtdone: selectedMmt,
                mmtremarks: mmtNotRequired,
                touchupdone: selectedTouchup,
                touchupremarks: touchupNotRequired,
                starttime: moment(startTime).format("YYYY-MM-DD HH:mm:ss"),
                endtime: moment(endTime).format("YYYY-MM-DD HH:mm:ss"),
                remarks: remarks,
                rubbertubeused: rubberTube,
                rtclamapused: rtClamp,
                oldrubbertubereturned: oldRubberTube,
                oldrtclapmreturned: oldRtClamp,
                status: selectedStatus
            };

            console.log("Input: " + JSON.stringify(toInput));

            updateAMCWork(toInput);

        }
    }

    const updateAMCWork = async (input) => {

        setLoading(true);

        await fetch(`${API_BASE}/app/work/updateamc`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
        })
            .then((response) => response.json())
            .then((response) => {
                console.log("resp: " + JSON.stringify(response));
                setLoading(false);
                Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT });
                if (response.code == 1) {
                    functionGetWork(staffId);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error('WORK DETAILS AMC There was an error!', error);
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
                                    <Text style={styles.itemTextHeading}>Works Id:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.works_id ? workDetails.works_id : ""}</Text>
                                </View>
                            </View>

                            {/* <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Date:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.date ? moment(workDetails.date).format("DD-MMM-YYYY") : ""}</Text>
                                </View>
                            </View> */}

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Customer Name:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.customer_name ? workDetails.customer_name : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Address:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.houseno ? workDetails.houseno + ", " : ""} {workDetails.city ? workDetails.city : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Assign DateTime:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.assigneddatetime ? moment(workDetails.assigneddatetime).format("DD-MMM-YYYY") : ""}</Text>
                                </View>
                            </View>

                        </View>

                        <View style={styles.itemContainer1}>
                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>AMC Done</Text>
                                <View style={styles.outerView}>
                                    <View style={{ flex: 1 }} >
                                        <CheckBox
                                            checked={selectedAmc == "Yes"}
                                            onPress={() => setSelectedAmc("Yes")}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="Yes"
                                        />
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <CheckBox
                                            checked={selectedAmc == "No"}
                                            onPress={() => setSelectedAmc("No")}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="No"
                                        />
                                    </View>
                                </View>
                                {selectedAmc == "Yes" ?
                                    <View style={styles.itemContainer1}>
                                        <Text style={styles.textHeading}>Images</Text>
                                        <View style={{ flexDirection: "row" }}>

                                            <TouchableHighlight onPress={() => { setAmcShowDetails(!amcShowDetails); }} style={styles.touchableOpacityImages} underlayColor={Colors.primaryLight2}>
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
                                                        <Text style={styles.buttonTextSave}>Upload Image</Text>
                                                    </TouchableHighlight>
                                                    : null}
                                            </View>
                                        </View>

                                    </View>
                                    :
                                    <View>
                                        {selectedAmc == "No" ?
                                            <View style={styles.itemContainer1}>
                                                <Text style={styles.textHeading}>Remarks</Text>
                                                <View style={{ flex: 1 }} >
                                                    <CheckBox
                                                        checked={selectedAmcNo == "House Closed"}
                                                        onPress={() => setSelectedAmcNo("House Closed")}
                                                        checkedIcon="dot-circle-o"
                                                        uncheckedIcon="circle-o"
                                                        checkedColor={Colors.primary}
                                                        uncheckedColor={Colors.lightGrey}
                                                        title="House Closed"
                                                    />
                                                </View>
                                                <View style={{ flex: 1 }} >
                                                    <CheckBox
                                                        checked={selectedAmcNo == "Not Agree"}
                                                        onPress={() => setSelectedAmcNo("Not Agree")}
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
                                            checked={selectedTouchup == "Yes"}
                                            onPress={() => setSelectedTouchup("Yes")}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="Yes"
                                        />
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <CheckBox
                                            checked={selectedTouchup == "No"}
                                            onPress={() => setSelectedTouchup("No")}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="No"
                                        />
                                    </View>
                                </View>
                                {selectedTouchup == "Yes" ?
                                    <View style={styles.itemContainer1}>
                                        <Text style={styles.textHeading}>Images</Text>
                                        <View style={{ flexDirection: "row" }}>

                                            <TouchableHighlight onPress={() => { setTouchupShowDetails(!touchupShowDetails); }} style={styles.touchableOpacityImages} underlayColor={Colors.primaryLight2}>
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
                                                        <Text style={styles.buttonTextSave}>Upload Image</Text>
                                                    </TouchableHighlight>
                                                    : null}
                                            </View>
                                        </View>

                                    </View>
                                    :
                                    <View>
                                        {selectedTouchup == "No" ?
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
                                            checked={selectedSandFill == "Yes"}
                                            onPress={() => setSelectedSandFill("Yes")}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="Yes"
                                        />
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <CheckBox
                                            checked={selectedSandFill == "No"}
                                            onPress={() => setSelectedSandFill("No")}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="No"
                                        />
                                    </View>
                                </View>
                                {selectedSandFill == "Yes" ?
                                    <View style={styles.itemContainer1}>
                                        <Text style={styles.textHeading}>Images</Text>
                                        <View style={{ flexDirection: "row" }}>

                                            <TouchableHighlight onPress={() => { setSandFillShowDetails(!sandFillShowDetails); }} style={styles.touchableOpacityImages} underlayColor={Colors.primaryLight2}>
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
                                                        <Text style={styles.buttonTextSave}>Upload Image</Text>
                                                    </TouchableHighlight>
                                                    : null}
                                            </View>
                                        </View>

                                    </View>
                                    :
                                    <View>
                                        {selectedSandFill == "No" ?
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
                                            checked={selectedMmt == "Yes"}
                                            onPress={() => setSelectedMmt("Yes")}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="Yes"
                                        />
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <CheckBox
                                            checked={selectedMmt == "No"}
                                            onPress={() => setSelectedMmt("No")}
                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checkedColor={Colors.primary}
                                            uncheckedColor={Colors.lightGrey}
                                            title="No"
                                        />
                                    </View>
                                </View>
                                {selectedMmt == "Yes" ?
                                    <View style={styles.itemContainer1}>
                                        <Text style={styles.textHeading}>Images</Text>
                                        <View style={{ flexDirection: "row" }}>

                                            <TouchableHighlight onPress={() => { setMmtShowDetails(!mmtShowDetails); }} style={styles.touchableOpacityImages} underlayColor={Colors.primaryLight2}>
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
                                                        <Text style={styles.buttonTextSave}>Upload Image</Text>
                                                    </TouchableHighlight>
                                                    : null}
                                            </View>
                                        </View>

                                    </View>
                                    :
                                    <View>
                                        {selectedMmt == "No" ?
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

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>Status</Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    itemTextStyle={styles.itemTextStyle}
                                    data={statusList}
                                    maxHeight={300}
                                    keyboardAvoiding
                                    activeColor={Colors.primaryLight2}
                                    labelField="status"
                                    valueField="status"
                                    placeholder={!(statusFocus) ? '- Select -' : '...'}
                                    value={statusValue}
                                    onFocus={() => { setStatusFocus(true); }}
                                    onBlur={() => { setStatusFocus(false); }}
                                    onChange={item => {
                                        setStatusValue(item.status);
                                        setStatusFocus(false);
                                        setSelectedStatus(item.status);
                                    }}
                                />
                                <View style={styles.viewStyle} />
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

AmcDetails.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
};

export default AmcDetails

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
        width: 125,
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