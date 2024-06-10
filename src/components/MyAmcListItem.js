import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, TouchableHighlight, Image, TextInput, FlatList } from 'react-native'
import { Colors, Fonts } from '../common/ConstantStyles'
import PropTypes from 'prop-types';
import moment from 'moment';
import { launchCamera } from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import { Icon } from 'react-native-elements';
import { API_BASE } from '../setupProxy';
import NoDataFound from '../common/NoDataFound';

const MyAmcListItem = ({ item, index, navigation, staffId, functionGetWork }) => {

    const [cameraPhoto, setCameraPhoto] = useState(null);
    const [cameraPhotoUri, setCameraPhotoUri] = useState("");
    const [remarks, setRemarks] = useState("");

    const [workImageList, setWorkImageList] = useState([]);

    const [showDetails, setShowDetails] = useState(false);

    const handleShowDetails = () => {
        setShowDetails(!showDetails);
    }

    const getAttachments = async () => {

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
                    setWorkImageList(response.model);
                }
            }).catch((error) => {
                console.error('WORK DPR GET ATTACHMENTS There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
            })
    }

    const handleCameraSelection = async () => {

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
            console.log('uri Camera-> ', response.assets[0].uri);
            console.log('width Camera-> ', response.assets[0].width);
            console.log('height Camera-> ', response.assets[0].height);
            console.log('fileSize Camera-> ', response.assets[0].fileSize);
            console.log('type Camera-> ', response.assets[0].type);
            console.log('fileName Camera-> ', response.assets[0].fileName);
            setCameraPhoto(response.assets[0]);
            setCameraPhotoUri(response.assets[0].uri);
        });
    };

    const saveImage = () => {

        Alert.alert(
            'Save Image', 'Are you sure you want to upload this image?',
            [
                { text: 'Cancel', onPress: () => Snackbar.show({ text: 'No Image Saved', duration: Snackbar.LENGTH_SHORT }) },
                { text: 'OK', onPress: () => uploadDocumentsToDatabase() },
            ], {
            cancelable: false,
        },
        );

    }

    const uploadDocumentsToDatabase = async () => {

        console.log("check: " + staffId + " " + item.works_id + " " + remarks);

        let formData = new FormData();

        formData.append('image', {
            uri: cameraPhoto.uri,
            type: cameraPhoto.type,
            name: cameraPhoto.fileName,
            size: cameraPhoto.fileSize,
        });
        
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
                    setCameraPhoto(null);
                    setCameraPhotoUri("");
                    getAttachments();
                } else {
                    setCameraPhoto(null);
                    setCameraPhotoUri("");
                }
            })
            .catch(error => {
                Snackbar.show({ text: 'Error occured while uploading. Please try again. ', duration: Snackbar.LENGTH_SHORT })
                console.log("error : " + error);
                setCameraPhoto(null);
                setCameraPhotoUri("");
            });

    }

    return (
        <View>
            <TouchableOpacity onPress={() => { navigation.navigate("AMC Details", { workDetailsItem: item, staffId: staffId, functionGetWork: (staffId) => functionGetWork(staffId) }) }}
                style={item.staffworkstatus == "Completed" ? styles.itemContainer1 : styles.itemContainer}>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Works Id:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.works_id ? item.works_id : ""}</Text>
                    </View>
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Date:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.date ? moment(item.date).format("DD-MMM-YYYY") : ""}</Text>
                    </View>
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Customer Name:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.name ? item.name : ""}</Text>
                    </View>
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Address:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.houseno ? item.houseno : null}, {item.city ? item.city : ""}</Text>
                    </View>
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Description:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.description ? item.description : ""}</Text>
                    </View>
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Address:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.customeraddress ? item.customeraddress : ""}</Text>
                    </View>
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Assign DateTime:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.assigneddatetime ? moment(item.assigneddatetime).format("DD-MMM-YYYY HH:mm:ss") : ""}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: "row" }}>

                    <TouchableHighlight onPress={() => { handleShowDetails(); getAttachments(); }} style={styles.touchableOpacityImages} underlayColor={Colors.primaryLight2}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon name="image" type="font-awesome" size={12} color={Colors.primary} />
                            <Text style={styles.buttonTextPhoto}>View Images</Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={() => { handleCameraSelection() }} style={styles.touchableOpacityPhoto} underlayColor={Colors.primaryLight2}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon name="camera" type="font-awesome" size={12} color={Colors.primary} />
                            <Text style={styles.buttonTextPhoto}>Take Photo</Text>
                        </View>
                    </TouchableHighlight>

                </View>

                {showDetails ?
                    <FlatList
                        data={workImageList}
                        ListEmptyComponent={<NoDataFound />}
                        renderItem={({ item, index }) => (
                            <View style={styles.imageContent}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View>
                                        <TouchableHighlight onPress={() => { navigation.navigate("View Image File", { file: `https://shrikarniinfra.in/uploads/works/${item.image}` }) }}>
                                            <Image style={styles.imageStyle} source={{ uri: `https://shrikarniinfra.in/uploads/works/${item.image}` }} />
                                        </TouchableHighlight>
                                    </View>

                                    <View style={styles.contentViewStyle}>
                                        <Text style={styles.textHeading}>Remarks</Text>
                                        <Text style={styles.textContent}>{item.remarks}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                    : null
                }

                {cameraPhotoUri ?
                    <View style={styles.imageContent}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View>
                                <TouchableHighlight onPress={() => { navigation.navigate("View Image File", { file: cameraPhotoUri }) }}>
                                    <Image style={styles.imageStyle} source={{ uri: cameraPhotoUri }} />
                                </TouchableHighlight>
                            </View>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>Remarks</Text>
                                <TextInput style={styles.textContent} value={remarks} onChangeText={(remarks) => setRemarks(remarks)} />
                                <View style={styles.viewStyle} />
                            </View>


                            <TouchableOpacity onPress={() => { setCameraPhoto(null); setCameraPhotoUri(""); }}>
                                <Icon name="cross" type="entypo" size={25} color="#F87171" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    : null}

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                    </View>
                    <View style={styles.innerView} >
                        {cameraPhotoUri ?
                            <TouchableHighlight onPress={() => { saveImage() }} style={styles.touchableOpacity}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableHighlight>
                            : null}
                    </View>
                </View>

            </TouchableOpacity>
        </View>

    );
}

MyAmcListItem.propTypes = {
    navigation: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    staffId: PropTypes.string.isRequired,
    functionGetWork: PropTypes.func.isRequired
};

export default MyAmcListItem

const styles = StyleSheet.create({
    itemContainer: {
        borderRadius: 5,
        backgroundColor: Colors.white,
        shadowColor: Colors.darkGrey,
        elevation: 10,
        margin: 10,
        padding: 10,
        borderWidth: 0.5,
        borderColor: Colors.primary,
    },
    itemContainer1: {
        borderRadius: 5,
        backgroundColor: Colors.lightGreen1,
        shadowColor: Colors.darkGrey,
        elevation: 10,
        margin: 10,
        padding: 10,
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
    itemTextViewImageHeading: {
        color: Colors.primary,
        fontFamily: Fonts.bold,
        fontWeight: "bold",
    },
    itemTextContent: {
        color: Colors.darkGrey,
        fontFamily: Fonts.regular,
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
    touchableOpacityImages: {
        width: 110,
        marginVertical: 2,
        marginHorizontal: 5,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        padding: 5,
    },
    touchableOpacity: {
        width: 75,
        backgroundColor: Colors.primary,
        borderRadius: 50,
        padding: 8,
    },
    buttonTextPhoto: {
        color: Colors.primary,
        textAlign: "center",
        fontFamily: Fonts.semiBold,
        marginStart: 5
    },
    buttonText: {
        color: Colors.white,
        textAlign: "center",
        fontFamily: Fonts.bold,
    },
    contentViewStyle: {
        margin: 5,
        flex: 1
    },
    textHeading: {
        color: Colors.primary,
    },
    textContent: {
        color: Colors.black,
        paddingTop: 10,
        paddingBottom: 5,
    },
    viewStyle: {
        backgroundColor: Colors.primary,
        height: 1,
    },
    imageContent: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 5,
        padding: 5,
        marginVertical: 5,
        flex: 1
    },
    imageStyle: {
        width: 75,
        height: 75,
        resizeMode: 'contain',
        margin: 5,
        backgroundColor: Colors.white
    }
});