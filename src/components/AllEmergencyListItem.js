import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TouchableHighlight } from 'react-native'
import { Colors, Fonts, FontSize } from '../common/ConstantStyles'
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';
import WorkAssignListItem from './WorkAssignListItem';
import { Icon } from 'react-native-elements';
import { API_BASE } from '../setupProxy';
import NoDataFound from '../common/NoDataFound';

type ItemTypes = {
    item: any;
    onSelect: any;
    isCheckbox: boolean;
    functionGetWork: any;
}

const AllEmergencyListItem = ({ item, onSelect, isCheckbox, functionGetWork }: ItemTypes) => {

    const [showDetails, setShowDetails] = useState(false);

    const handleShowDetails = () => {
        setShowDetails(!showDetails);
    }

    return (
        <View>

            <TouchableOpacity style={item.works.length == 0 ? styles.itemContainer : item.status == 'Completed' ? styles.itemContainer2 : styles.itemContainer1} >

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Date Time:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.calltime ? moment(item.calltime).format("DD-MMM-YYYY HH:mm:ss") : ""}</Text>
                    </View>
                    <View style={{ justifyContent: "center", }}>
                        {isCheckbox && <CheckBox
                            onValueChange={newValue => { onSelect(newValue); }}
                            value={item.isSelected}
                            tintColors
                        />}
                    </View>
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Cust. No.:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.customerno ? item.customerno : ""}</Text>
                    </View>
                    <View style={{ justifyContent: "center" }} />
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Cust. Name:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.customername ? item.customername : ""}</Text>
                    </View>
                    <View style={{ justifyContent: "center" }} />
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Cust. Phone:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.customerphone ? item.customerphone : ""}</Text>
                    </View>
                    <View style={{ justifyContent: "center" }} />
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Address:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.address ? item.address : ""}</Text>
                    </View>
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Location:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.location[0].locationname ? item.location[0].locationname : ""}</Text>
                    </View>
                </View>

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Remarks:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.remarks ? item.remarks : ""}</Text>
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
                        <Text style={styles.itemTextContent}>{item.created_at ? moment(item.created_at).format("DD-MMM-YYYY HH:mm:ss") : ""}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: "row" }}>

                    <TouchableHighlight onPress={() => {handleShowDetails(); getAttachments();}} style={styles.touchableOpacityImages} underlayColor={Colors.primaryLight2}>
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

                {item.works.length != 0 ?
                    <View>
                        <Text style={styles.itemTextHeadingWork} onPress={() => { handleShowDetails() }}>Work Details</Text>

                        {showDetails ?
                            <View style={{ flex: 1 }}>

                                <View style={styles.itemContentHeading}>
                                    <Text style={[{ fontWeight: "bold" }, styles.tblIndexContent]} >#</Text>
                                    <Text style={[{ fontWeight: "bold" }, styles.tblOtherContent]} >Name</Text>
                                    <Text style={[{ fontWeight: "bold" }, styles.tblOtherContent]} >Date</Text>
                                    <Text style={[{ fontWeight: "bold" }, styles.tblOtherContent]} >Status</Text>
                                    <Text style={[{ fontWeight: "bold" }, styles.tblIndexContent]} ></Text>
                                </View>

                                <FlatList
                                    data={item.works}
                                    keyExtractor={(item, index) => { return index.toString(); }}
                                    renderItem={({ item, index }) => <WorkAssignListItem item={item} index={index} functionGetWork={() => { functionGetWork() }} />}
                                    showsHorizontalScrollIndicator={false}
                                    ListEmptyComponent={<NoDataFound />}
                                />

                            </View>
                            : null
                        }
                    </View>
                    : null
                }

            </TouchableOpacity>

        </View>

    );
}

export default AllEmergencyListItem

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
        backgroundColor: Colors.lightYellow,
        shadowColor: Colors.darkGrey,
        elevation: 10,
        margin: 10,
        padding: 10,
        borderWidth: 0.5,
        borderColor: Colors.primary,
    },
    itemContainer2: {
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
    itemTextContent: {
        color: Colors.darkGrey,
        fontFamily: Fonts.regular,
    },
    itemTextHeadingWork: {
        color: Colors.primary,
        fontFamily: Fonts.bold,
        fontWeight: "bold",
        padding: 5,
        marginTop: 5,
    },
    itemContentHeading: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: Colors.lightGrey,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    tblIndexContent: {
        flex: 0.5,
        color: Colors.black,
        fontSize: FontSize.smallMedium,
    },
    tblOtherContent: {
        flex: 1,
        color: Colors.black,
        fontSize: FontSize.smallMedium,
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
    buttonTextPhoto: {
        color: Colors.primary,
        textAlign: "center",
        fontFamily: Fonts.semiBold,
        marginStart: 5
    },
});