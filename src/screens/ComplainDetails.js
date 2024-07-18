import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native'
import { Colors, FontSize, Fonts } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import PropTypes from 'prop-types';
import { API_BASE } from '../setupProxy';
import Snackbar from 'react-native-snackbar';
import Autocomplete from 'react-native-autocomplete-input';

const List = [
    { id: 1, status: "Completed" },
    { id: 2, status: "Pending" },
]

const ComplainDetails = ({ navigation, route }) => {

    const { workDetailsItem, staffId, functionGetWork } = route.params;

    const [loading, setLoading] = useState(true);
    const [workDetails, setWorkDetails] = useState([]);

    const [remarks, setRemarks] = useState("");
    const [remarksList, setRemarksList] = useState([]);

    const [remarks2, setRemarks2] = useState("");

    const [statusList, setStatusList] = useState([]);
    const [statusValue, setStatusValue] = useState(null);
    const [statusFocus, setStatusFocus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");

    useEffect(() => {

        getWorkDetails();
        setStatusList(List);

    }, []);

    const getWorkDetails = async () => {

        if (workDetailsItem !== null || workDetailsItem !== "") {
            setLoading(false);
            getRemarksList();
            setWorkDetails(workDetailsItem);
        }

        setRemarks(workDetailsItem.remarks);
        setRemarks2(workDetailsItem.remarks2);
        setStatusValue(workDetailsItem.staffworkstatus);
        setSelectedStatus(workDetailsItem.staffworkstatus);

    }

    const getRemarksList = async () => {

        let toInput = {
            type: "tracker",
        };

        await fetch(`${API_BASE}/app/work/listremarks`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        })
            .then((response) => response.json())
            .then((response) => {

                if (response) {
                    setRemarksList(response);
                } else {
                    Snackbar.show({ text: 'Unable to load data', duration: Snackbar.LENGTH_SHORT })
                }

            })
            .catch((error) => {
                console.error('WORK There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
            })

    }

    const saveData = async () => {
        if (Keyboard.isVisible) {
            Keyboard.dismiss();
        }

        console.log(
            " staffs_id: " + staffId +
            " worksid: " + workDetailsItem.id +
            " worktype: " + "complain" +
            " remarks: " + remarks +
            " remarks2: " + remarks2 +
            " status: " + selectedStatus
        );

        if (remarks === "" || remarks == null) {
            Snackbar.show({ text: 'Please Enter Remarks', duration: Snackbar.LENGTH_SHORT });
        } else {
            setLoading(true);

            let toInput = {
                worksid: workDetailsItem.id,
                worktype: "complain",
                remarks: remarks,
                staffs_id: staffId,
                remarks2: remarks2,
                status: selectedStatus
            };

            await fetch(`${API_BASE}/app/work/updatework`, {
                method: "POST",
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(toInput)
            })
                .then((response) => response.json())
                .then((response) => {

                    setLoading(false);

                    if (response.code === 1) {
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

    }

    const [filteredRemarks, setFilteredRemarks] = useState([]);
    const findRemarks = (query) => {
        if (query) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            setFilteredRemarks(remarksList.filter((item) => item.remarks.search(regex) >= 0));
            setRemarks(query);
        } else {
            setFilteredRemarks([]);
            setRemarks(query);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView keyboardShouldPersistTaps='handled' >

                {loading ?
                    <ActivityIndicator />
                    :
                    <View style={{ marginBottom: 10 }}>

                        <TouchableOpacity style={styles.touchableOpacity} onPress={() => { navigation.navigate("Complain Material Used", { workId: workDetailsItem.id }) }}>
                            <Text style={styles.buttonText}>Material Used</Text>
                        </TouchableOpacity>

                        <View style={styles.itemContainer}>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Customer Name:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.customer ? workDetails.customer : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>List Name:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.listname ? workDetails.listname : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Complain Type:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.typeofcomplain ? workDetails.typeofcomplain : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Details:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.description ? workDetails.description : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Date:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.date ? moment(workDetails.date).format("DD-MMM-YYYY") : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Address:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>
                                        {workDetails.street1 ? workDetails.street1 : ""}, {workDetails.street2 ? workDetails.street2 : ""}, {workDetails.street3 ? workDetails.street3 : ""}, {workDetails.city ? workDetails.city : ""}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Notification:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.notification ? workDetails.notification : ""}</Text>
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
                                    <Text style={styles.itemTextHeading}>Req. Start Dt.:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.requiredstartdate ? moment(workDetails.requiredstartdate).format("DD-MMM-YYYY") : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Req. End Dt.:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.requiredenddate ? moment(workDetails.requiredenddate).format("DD-MMM-YYYY") : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Code Group Text:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.codegrouptext ? workDetails.codegrouptext : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Code Msg Text:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.codemessagetext ? workDetails.codemessagetext : ""}</Text>
                                </View>
                            </View>

                        </View>

                        <View style={styles.itemContainer1}>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>Remarks</Text>
                                <Autocomplete
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    inputContainerStyle={{ borderBottomWidth: 2, borderTopWidth: 0, borderStartWidth: 0, borderEndWidth: 0, borderColor: Colors.grey, }}
                                    data={filteredRemarks}
                                    defaultValue={JSON.stringify(remarksList) === '{}' ? '' : remarks}
                                    onChangeText={(text) => findRemarks(text)}
                                    placeholder="Remarks"
                                    style={styles.textContent}
                                    placeholderTextColor={Colors.grey}
                                    flatListProps={{
                                        keyExtractor: (_, idx) => idx,
                                        renderItem: ({ item }) =>
                                            <TouchableOpacity onPress={() => { setRemarks(item.remarks); setFilteredRemarks([]); Keyboard.dismiss(); }}>
                                                <Text style={styles.textContent}> {item.remarks} </Text>
                                            </TouchableOpacity>,
                                        keyboardShouldPersistTaps: 'handled',
                                    }}
                                />
                            </View>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>Remarks 2</Text>
                                <TextInput style={styles.textContent} value={remarks2} onChangeText={(remarks2) => setRemarks2(remarks2)} />
                                <View style={styles.viewStyle} />
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
});