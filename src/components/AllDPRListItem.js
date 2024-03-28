import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { Colors, Fonts, FontSize } from '../common/ConstantStyles'
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';
import WorkAssignListItem from './WorkAssignListItem';
import NoDataFound from '../common/NoDataFound';

type ItemTypes = {
    item: any;
    onSelect: any;
    isCheckbox: boolean;
    functionGetWork: any;
}

const AllDprListItem = ({ item, onSelect, isCheckbox, functionGetWork }: ItemTypes) => {

    const [showDetails, setShowDetails] = useState(false);

    const handleShowDetails = () => {
        setShowDetails(!showDetails);
    }

    return (
        <View>

            <TouchableOpacity style={item.works.length == 0 ? styles.itemContainer : item.status == 'Completed'? styles.itemContainer2 : styles.itemContainer1} >

                <View style={styles.outerView}>
                    <View style={styles.innerHeadingView}>
                        <Text style={styles.itemTextHeading}>Date:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.date ? moment(item.date).format("DD-MMM-YYYY") : ""}</Text>
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
                        <Text style={styles.itemTextHeading}>Customer Name:</Text>
                    </View>
                    <View style={styles.innerView}>
                        <Text style={styles.itemTextContent}>{item.name ? item.name : ""}</Text>
                    </View>
                    <View style={{ justifyContent: "center" }} />
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
                        <Text style={styles.itemTextContent}>{item.created_at ? moment(item.created_at).format("DD-MMM-YYYY HH:mm:ss") : ""}</Text>
                    </View>
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

export default AllDprListItem

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
});