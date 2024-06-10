import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native'
import { Colors, FontSize, Fonts } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import moment from 'moment';
import { Icon } from 'react-native-elements';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import PropTypes from 'prop-types';
import { API_BASE } from '../setupProxy';
import { Dropdown } from 'react-native-element-dropdown';
import Snackbar from 'react-native-snackbar';
import Autocomplete from 'react-native-autocomplete-input';

const List = [
    { id: 1, status: "Completed" },
    { id: 2, status: "Pending" },
]

const WorkDetails = ({ navigation, route }) => {

    const { workDetailsItem, staffId, functionGetWork } = route.params;

    const [loading, setLoading] = useState(true);
    const [workDetails, setWorkDetails] = useState([]);

    const [extraKitchenPoint, setExtraKitchenPoint] = useState("");
    const [extraGeyserPoint, setExtraGeyserPoint] = useState("");

    const [plbDate, setPlbDate] = useState();
    const [plbRemarks, setPlbRemarks] = useState("");
    const [plbRemarksList, setPlbRemarksList] = useState([]);
    const [showPlbRemarkList, setShowPlbRemarkList] = useState(false);

    const [pptDate, setPptDate] = useState();
    const [pptRemarks, setPptRemarks] = useState("");
    const [pptRemarksList, setPptRemarksList] = useState([]);
    const [showPptRemarkList, setShowPptRemarkList] = useState(false);

    const [gcDate, setGcDate] = useState();
    const [gcRemarks, setGcRemarks] = useState("");
    const [gcRemarksList, setGcRemarksList] = useState([]);
    const [showGcRemarkList, setShowGcRemarkList] = useState(false);

    const [mmtDate, setMmtDate] = useState();
    const [mmtRemarks, setMmtRemarks] = useState("");
    const [mmtRemarksList, setMmtRemarksList] = useState([]);
    const [showMmtRemarkList, setShowMmtRemarkList] = useState(false);

    const [conversionDate, setConversionDate] = useState();
    const [conversionRemarks, setConversionRemarks] = useState("");
    const [conversionRemarksList, setConversionRemarksList] = useState([]);
    const [showConversionRemarkList, setShowConversionRemarkList] = useState(false);

    const [remarks, setRemarks] = useState("");
    const [remarksList, setRemarksList] = useState([]);
    const [showRemarkList, setShowRemarkList] = useState(false);

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

            console.log("workDetailsItem.plbdate : " + workDetailsItem.plbdate);
            console.log("workDetailsItem.pptdate : " + workDetailsItem.pptdate);
            console.log("workDetailsItem.gcdate : " + workDetailsItem.gcdate);
            console.log("workDetailsItem.mmtdate : " + workDetailsItem.mmtdate);
            console.log("workDetailsItem.conversiondate : " + workDetailsItem.conversiondate);

            if (workDetailsItem.plbdate) {
                let plbdate = moment(workDetailsItem.plbdate).format('YYYY-MM-DD')
                let parsedPlbDate = new Date(plbdate);
                setPlbDate(parsedPlbDate);
            }

            if (workDetailsItem.pptdate) {
                let pptdate = moment(workDetailsItem.pptdate).format('YYYY-MM-DD')
                let parsedPptDate = new Date(pptdate);
                setPptDate(parsedPptDate);
            }

            if (workDetailsItem.gcdate) {
                let gcdate = moment(workDetailsItem.gcdate).format('YYYY-MM-DD')
                let parsedGcDate = new Date(gcdate);
                setGcDate(parsedGcDate);
            }

            if (workDetailsItem.mmtdate) {
                let mmtdate = moment(workDetailsItem.mmtdate).format('YYYY-MM-DD')
                let parsedMmtDate = new Date(mmtdate);
                setMmtDate(parsedMmtDate);
            }

            if (workDetailsItem.conversiondate) {
                let conversiondate = moment(workDetailsItem.conversiondate).format('YYYY-MM-DD')
                let parsedConversionDate = new Date(conversiondate);
                setConversionDate(parsedConversionDate);
            }

            if (workDetailsItem.extrakitchenpoint !== '') {
                setExtraKitchenPoint(workDetailsItem.extrakitchenpoint);
            } else {
                setExtraKitchenPoint("");
            }

            if (workDetailsItem.extrageyserpoint !== '') {
                setExtraGeyserPoint(workDetailsItem.extrageyserpoint);
            } else {
                setExtraGeyserPoint("");
            }

            if (workDetailsItem.plbremarks) { setPlbRemarks(workDetailsItem.plbremarks); }
            if (workDetailsItem.pptremarks) { setPptRemarks(workDetailsItem.pptremarks); }
            if (workDetailsItem.gcremarks) { setGcRemarks(workDetailsItem.gcremarks); }
            if (workDetailsItem.mmtremarks) { setMmtRemarks(workDetailsItem.mmtremarks); }
            if (workDetailsItem.conversionremarks) { setConversionRemarks(workDetailsItem.conversionremarks); }

            setRemarks(workDetailsItem.remarks);

            setRemarks2(workDetailsItem.remarks2);

            setStatusValue(workDetailsItem.staffworkstatus);

            setSelectedStatus(workDetailsItem.staffworkstatus);

        }

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
                    setPlbRemarksList(response);
                    setPptRemarksList(response);
                    setGcRemarksList(response);
                    setMmtRemarksList(response);
                    setConversionRemarksList(response);
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

    const onPlbDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setPlbDate(currentDate);

    };

    const showPlbDatepicker = () => {

        DateTimePickerAndroid.open({
            value: plbDate ? plbDate : new Date(),
            onChange: onPlbDateChange,
            mode: 'date',
            is24Hour: true,
        });
    };

    const onPptDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setPptDate(currentDate);

    };

    const showPptDatepicker = () => {

        DateTimePickerAndroid.open({
            value: pptDate ? pptDate : new Date(),
            onChange: onPptDateChange,
            mode: 'date',
            is24Hour: true,
        });
    };

    const onGcDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setGcDate(currentDate);

    };

    const showGcDatepicker = () => {

        DateTimePickerAndroid.open({
            value: gcDate ? gcDate : new Date(),
            onChange: onGcDateChange,
            mode: 'date',
            is24Hour: true,
        });
    };

    const onMmtDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setMmtDate(currentDate);

    };

    const showMmtDatepicker = () => {

        DateTimePickerAndroid.open({
            value: mmtDate ? mmtDate : new Date(),
            onChange: onMmtDateChange,
            mode: 'date',
            is24Hour: true,
        });
    };

    const onConversionDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setConversionDate(currentDate);
    };

    const showConversionDatepicker = () => {

        DateTimePickerAndroid.open({
            value: conversionDate ? conversionDate : new Date(),
            onChange: onConversionDateChange,
            mode: 'date',
            is24Hour: true,
        });
    };

    const updateWorkDetails = async () => {

        if (remarks === "" || remarks == null) {
            Snackbar.show({ text: 'Please Enter Remarks', duration: Snackbar.LENGTH_SHORT });
        }
        else {

            let plbdatePassed, pptdatePassed, gcdatePassed, mmtdatePassed, conversiondatePassed;

            // console.log("staffId: " + staffId);
            // console.log("workId: " + workDetailsItem.id);
            // console.log("extraKitchenPoint: " + extraKitchenPoint);
            // console.log("extraGeyserPoint: " + extraGeyserPoint);
            if (workDetailsItem.plbdate === null && !plbDate) {
                plbdatePassed = null;
                console.log("PlbDate: " + "null");
            } else {
                plbdatePassed = moment(plbDate).format("YYYY-MM-DD");
                console.log("PlbDate: " + moment(plbDate).format("YYYY-MM-DD"));
            }
            // console.log("PlbRemarks: " + plbRemarks);
            if (workDetailsItem.pptdate === null && !pptDate) {
                pptdatePassed = null;
                console.log("PptDate: " + "null");
            } else {
                pptdatePassed = moment(pptDate).format("YYYY-MM-DD");
                console.log("PptDate: " + moment(pptDate).format("YYYY-MM-DD"));
            }
            // console.log("PptRemarks: " + pptRemarks);
            if (workDetailsItem.gcdate === null && !gcDate) {
                gcdatePassed = null;
                console.log("GcDate: " + "null");
            } else {
                gcdatePassed = moment(gcDate).format("YYYY-MM-DD");
                console.log("GcDate: " + moment(gcDate).format("YYYY-MM-DD"));
            }
            // console.log("GcRemarks: " + gcRemarks);
            if (workDetailsItem.mmtdate === null && !mmtDate) {
                mmtdatePassed = null;
                console.log("MmtDate: " + "null");
            } else {
                mmtdatePassed = moment(mmtDate).format("YYYY-MM-DD");
                console.log("MmtDate: " + moment(mmtDate).format("YYYY-MM-DD"));
            }
            // console.log("MmtRemarks: " + mmtRemarks);
            if (workDetailsItem.conversiondate === null && !conversionDate) {
                conversiondatePassed = null;
                console.log("ConversionDate: " + "null");
            } else {
                conversiondatePassed = moment(conversionDate).format("YYYY-MM-DD");
                console.log("ConversionDate: " + moment(conversionDate).format("YYYY-MM-DD"));
            }
            // console.log("ConversionRemarks: " + conversionRemarks);
            // console.log("remarks: " + remarks);
            // console.log("remarks2: " + remarks2);
            // console.log("status: " + selectedStatus);

            // setLoading(true);

            let toInput = {
                worksid: workDetailsItem.id,
                remarks: remarks,
                staffs_id: staffId,
                remarks2: remarks2,
                status: selectedStatus,
                extrakitchenpoint: extraKitchenPoint,
                extrageyserpoint: extraGeyserPoint,
                plbdate: plbdatePassed,
                plbremarks: plbRemarks,
                pptdate: pptdatePassed,
                pptremarks: pptRemarks,
                gcdate: gcdatePassed,
                gcremarks: gcRemarks,
                mmtdate: mmtdatePassed,
                mmtremarks: mmtRemarks,
                conversiondate: conversiondatePassed,
                conversionremarks: conversionRemarks
            };

            console.log("toInput: " + JSON.stringify(toInput));

            await fetch(`${API_BASE}/app/work/updatetracker`, {
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
                    console.error('WORK DETAILS TRACKER There was an error!', error);
                    Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
                })
        }

    }

    const [filteredPlbRemarks, setFilteredPlbRemarks] = useState([]);
    const findPlbRemarks = (query) => {
        if (query) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            setFilteredPlbRemarks(plbRemarksList.filter((item) => item.remarks.search(regex) >= 0));
            setPlbRemarks(query);
        } else {
            setFilteredPlbRemarks([]);
            setPlbRemarks(query);
        }
    };

    const [filteredPptRemarks, setFilteredPptRemarks] = useState([]);
    const findPptRemarks = (query) => {
        if (query) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            setFilteredPptRemarks(pptRemarksList.filter((item) => item.remarks.search(regex) >= 0));
            setPptRemarks(query);
        } else {
            setFilteredPptRemarks([]);
            setPptRemarks(query);
        }
    };

    const [filteredGcRemarks, setFilteredGcRemarks] = useState([]);
    const findGcRemarks = (query) => {
        if (query) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            setFilteredGcRemarks(gcRemarksList.filter((item) => item.remarks.search(regex) >= 0));
            setGcRemarks(query);
        } else {
            setFilteredGcRemarks([]);
            setGcRemarks(query);
        }
    };

    const [filteredMmtRemarks, setFilteredMmtRemarks] = useState([]);
    const findMmtRemarks = (query) => {
        if (query) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            setFilteredMmtRemarks(mmtRemarksList.filter((item) => item.remarks.search(regex) >= 0));
            setMmtRemarks(query);
        } else {
            setFilteredMmtRemarks([]);
            setMmtRemarks(query);
        }
    };

    const [filteredConversionRemarks, setFilteredConversionRemarks] = useState([]);
    const findConversionRemarks = (query) => {
        if (query) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            setFilteredConversionRemarks(conversionRemarksList.filter((item) => item.remarks.search(regex) >= 0));
            setConversionRemarks(query);
        } else {
            setFilteredConversionRemarks([]);
            setConversionRemarks(query);
        }
    };

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
            <ScrollView keyboardShouldPersistTaps='handled'>

                {loading ?
                    <ActivityIndicator />
                    :
                    <View style={{ marginBottom: 10 }}>

                        <TouchableOpacity style={styles.touchableOpacity} onPress={() => { navigation.navigate("Material Used", { workId: workDetailsItem.id }) }}>
                            <Text style={styles.buttonText}>Material Used</Text>
                        </TouchableOpacity>

                        <View style={styles.itemContainer}>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Application No.:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.applicationno ? workDetails.applicationno : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Order No.:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.orderno ? workDetails.orderno : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Premise Type:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.premisetype ? workDetails.premisetype : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Record Create Dt.:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}> {workDetails.recordcreateddate !== '0000-00-00' ? <Text style={styles.textContent}>{workDetails.recordcreateddate ? moment(workDetails.recordcreateddate).format("DD-MMM-YYYY") : ""}</Text> : <Text style={styles.textContent}></Text>}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Customer Name:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.customername ? workDetails.customername : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Telephone Number:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.telephone ? workDetails.telephone : ""}</Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Address:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>
                                        {workDetails.houseno ? workDetails.houseno + ", " : ""}
                                        {workDetails.street1 ? workDetails.street1 + ", " : ""}
                                        {workDetails.street2 ? workDetails.street2 + ", " : ""}
                                        {workDetails.street3 ? workDetails.street3 + ", " : ""}
                                        {workDetails.city ? workDetails.city + ", " : ""}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.outerView}>
                                <View style={styles.innerHeadingView}>
                                    <Text style={styles.itemTextHeading}>Business Partner No:</Text>
                                </View>
                                <View style={styles.innerView}>
                                    <Text style={styles.itemTextContent}>{workDetails.businesspartnerno ? workDetails.businesspartnerno : ""}</Text>
                                </View>
                            </View>

                        </View>

                        <View style={styles.itemContainer1}>

                            <View style={styles.contentViewStyleRow}>
                                <View style={styles.contentViewStyle}>
                                    <Text style={styles.textHeading}>Extra Kitchen Point</Text>
                                    <TextInput style={styles.textContent} value={extraKitchenPoint} onChangeText={(extraKitchenPoint) => setExtraKitchenPoint(extraKitchenPoint)} />
                                    <View style={styles.viewStyle} />
                                </View>
                                <View style={styles.contentViewStyle}>
                                    <Text style={styles.textHeading}>Extra Geyser Point</Text>
                                    <TextInput style={styles.textContent} value={extraGeyserPoint} onChangeText={(extraGeyserPoint) => setExtraGeyserPoint(extraGeyserPoint)} />
                                    <View style={styles.viewStyle} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.itemContainer1}>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>PLB Date</Text>
                                <View style={styles.contentSubViewStyleRow}>
                                    <View style={{ marginEnd: 5 }}><Icon name="calendar" type="font-awesome" size={20} color="#044F87" onPress={showPlbDatepicker} /></View>
                                    <Text style={styles.textContent}>
                                        {workDetailsItem.plbdate == null ?
                                            <>
                                                {plbDate ? moment(plbDate).format("DD-MMM-YYYY") : "N/A"}
                                            </>
                                            :
                                            moment(plbDate).format("DD-MMM-YYYY")
                                        }
                                    </Text>
                                </View>
                                <View style={styles.viewStyle} />
                            </View>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>PLB Remarks</Text>
                                <Autocomplete
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    inputContainerStyle={{ borderBottomWidth: 2, borderTopWidth: 0, borderStartWidth: 0, borderEndWidth: 0, borderColor: Colors.grey }}
                                    data={filteredPlbRemarks}
                                    defaultValue={JSON.stringify(plbRemarksList) === '{}' ? '' : plbRemarks}
                                    onChangeText={(text) => findPlbRemarks(text)}
                                    placeholder="PLB Remarks"
                                    style={styles.textContent}
                                    placeholderTextColor={Colors.grey}
                                    flatListProps={{
                                        keyExtractor: (_, idx) => idx,
                                        renderItem: ({ item }) =>
                                            <TouchableOpacity onPress={() => { setPlbRemarks(item.remarks); setFilteredPlbRemarks([]); Keyboard.dismiss(); }}>
                                                <Text style={styles.textContent}> {item.remarks} </Text>
                                            </TouchableOpacity>,
                                        keyboardShouldPersistTaps: 'handled',
                                    }}
                                />
                            </View>

                        </View>

                        <View style={styles.itemContainer1}>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>PPT Date</Text>
                                <View style={styles.contentSubViewStyleRow}>
                                    <View style={{ marginEnd: 5 }}><Icon name="calendar" type="font-awesome" size={20} color="#044F87" onPress={showPptDatepicker} /></View>
                                    <Text style={styles.textContent}>
                                        {workDetailsItem.pptdate == null ?
                                            <>
                                                {pptDate ? moment(pptDate).format("DD-MMM-YYYY") : "N/A"}
                                            </>
                                            :
                                            moment(pptDate).format("DD-MMM-YYYY")
                                        }
                                    </Text>
                                </View>
                                <View style={styles.viewStyle} />
                            </View>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>PPT Remarks</Text>
                                <Autocomplete
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    inputContainerStyle={{ borderBottomWidth: 2, borderTopWidth: 0, borderStartWidth: 0, borderEndWidth: 0, borderColor: Colors.grey }}
                                    data={filteredPptRemarks}
                                    defaultValue={JSON.stringify(pptRemarksList) === '{}' ? '' : pptRemarks}
                                    onChangeText={(text) => findPptRemarks(text)}
                                    placeholder="PPT Remarks"
                                    style={styles.textContent}
                                    placeholderTextColor={Colors.grey}
                                    flatListProps={{
                                        keyExtractor: (_, idx) => idx,
                                        renderItem: ({ item }) =>
                                            <TouchableOpacity onPress={() => { setPptRemarks(item.remarks); setFilteredPptRemarks([]); Keyboard.dismiss(); }}>
                                                <Text style={styles.textContent}> {item.remarks} </Text>
                                            </TouchableOpacity>,
                                        keyboardShouldPersistTaps: 'handled',
                                    }}
                                />
                            </View>
                        </View>

                        <View style={styles.itemContainer1}>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>GC Date</Text>
                                <View style={styles.contentSubViewStyleRow}>
                                    <View style={{ marginEnd: 5 }}><Icon name="calendar" type="font-awesome" size={20} color="#044F87" onPress={showGcDatepicker} /></View>
                                    <Text style={styles.textContent}>
                                        {workDetailsItem.gcdate == null ?
                                            <>
                                                {gcDate ? moment(gcDate).format("DD-MMM-YYYY") : "N/A"}
                                            </>
                                            :
                                            moment(gcDate).format("DD-MMM-YYYY")
                                        }
                                    </Text>
                                </View>
                                <View style={styles.viewStyle} />
                            </View>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>GC Remarks</Text>
                                <Autocomplete
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    inputContainerStyle={{ borderBottomWidth: 2, borderTopWidth: 0, borderStartWidth: 0, borderEndWidth: 0, borderColor: Colors.grey }}
                                    data={filteredGcRemarks}
                                    defaultValue={JSON.stringify(gcRemarksList) === '{}' ? '' : gcRemarks}
                                    onChangeText={(text) => findGcRemarks(text)}
                                    placeholder="GC Remarks"
                                    style={styles.textContent}
                                    placeholderTextColor={Colors.grey}
                                    flatListProps={{
                                        keyExtractor: (_, idx) => idx,
                                        renderItem: ({ item }) =>
                                            <TouchableOpacity onPress={() => { setGcRemarks(item.remarks); setFilteredGcRemarks([]); Keyboard.dismiss(); }}>
                                                <Text style={styles.textContent}> {item.remarks} </Text>
                                            </TouchableOpacity>,
                                        keyboardShouldPersistTaps: 'handled',
                                    }}
                                />
                            </View>
                        </View>
                        <View style={styles.itemContainer1}>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>MMT Date</Text>
                                <View style={styles.contentSubViewStyleRow}>
                                    <View style={{ marginEnd: 5 }}><Icon name="calendar" type="font-awesome" size={20} color="#044F87" onPress={showMmtDatepicker} /></View>
                                    <Text style={styles.textContent}>
                                        {workDetailsItem.mmtdate == null ?
                                            <>
                                                {mmtDate ? moment(mmtDate).format("DD-MMM-YYYY") : "N/A"}
                                            </>
                                            :
                                            moment(mmtDate).format("DD-MMM-YYYY")
                                        }
                                    </Text>
                                </View>
                                <View style={styles.viewStyle} />
                            </View>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>MMT Remarks</Text>
                                <Autocomplete
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    inputContainerStyle={{ borderBottomWidth: 2, borderTopWidth: 0, borderStartWidth: 0, borderEndWidth: 0, borderColor: Colors.grey }}
                                    data={filteredMmtRemarks}
                                    defaultValue={JSON.stringify(mmtRemarksList) === '{}' ? '' : mmtRemarks}
                                    onChangeText={(text) => findMmtRemarks(text)}
                                    placeholder="MMT Remarks"
                                    style={styles.textContent}
                                    placeholderTextColor={Colors.grey}
                                    flatListProps={{
                                        keyExtractor: (_, idx) => idx,
                                        renderItem: ({ item }) =>
                                            <TouchableOpacity onPress={() => { setMmtRemarks(item.remarks); setFilteredMmtRemarks([]); Keyboard.dismiss(); }}>
                                                <Text style={styles.textContent}> {item.remarks} </Text>
                                            </TouchableOpacity>,
                                        keyboardShouldPersistTaps: 'handled',
                                    }}
                                />
                            </View>
                        </View>
                        <View style={styles.itemContainer1}>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>Conversion Date</Text>
                                <View style={styles.contentSubViewStyleRow}>
                                    <View style={{ marginEnd: 5 }}><Icon name="calendar" type="font-awesome" size={20} color="#044F87" onPress={showConversionDatepicker} /></View>
                                    <Text style={styles.textContent}>
                                        {workDetailsItem.conversiondate == null ?
                                            <>
                                                {conversionDate ? moment(conversionDate).format("DD-MMM-YYYY") : "N/A"}
                                            </>
                                            :
                                            moment(conversionDate).format("DD-MMM-YYYY")
                                        }
                                    </Text>
                                </View>
                                <View style={styles.viewStyle} />
                            </View>

                            <View style={styles.contentViewStyle}>
                                <Text style={styles.textHeading}>Conversion Remarks</Text>
                                <Autocomplete
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    inputContainerStyle={{ borderBottomWidth: 2, borderTopWidth: 0, borderStartWidth: 0, borderEndWidth: 0, borderColor: Colors.grey }}
                                    data={filteredConversionRemarks}
                                    defaultValue={JSON.stringify(conversionRemarksList) === '{}' ? '' : conversionRemarks}
                                    onChangeText={(text) => findConversionRemarks(text)}
                                    placeholder="Conversion Remarks"
                                    style={styles.textContent}
                                    placeholderTextColor={Colors.grey}
                                    flatListProps={{
                                        keyExtractor: (_, idx) => idx,
                                        renderItem: ({ item }) =>
                                            <TouchableOpacity onPress={() => { setConversionRemarks(item.remarks); setFilteredConversionRemarks([]); Keyboard.dismiss(); }}>
                                                <Text style={styles.textContent}> {item.remarks} </Text>
                                            </TouchableOpacity>,
                                        keyboardShouldPersistTaps: 'handled',
                                    }}
                                />
                            </View>
                        </View>
                        <View style={styles.itemContainer1}>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textHeading}>Remarks</Text><Text style={{ color: Colors.red, marginHorizontal: 10 }}>*</Text>
                            </View>

                            <View style={styles.contentViewStyle}>
                                <Autocomplete
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    inputContainerStyle={{ borderBottomWidth: 2, borderTopWidth: 0, borderStartWidth: 0, borderEndWidth: 0, borderColor: Colors.grey }}
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



                        <TouchableOpacity style={styles.touchableOpacity} onPress={() => { updateWorkDetails() }}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>


                    </View>
                }

            </ScrollView >
        </KeyboardAvoidingView>
    )
}

WorkDetails.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
};

export default WorkDetails

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
    buttonTextModal: {
        color: Colors.white,
        textAlign: "center",
        fontSize: FontSize.medium,
        fontFamily: Fonts.bold,
        width: 100
    },
    contentSubViewStyleRow: {
        flexDirection: "row",
        alignItems: "center",
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