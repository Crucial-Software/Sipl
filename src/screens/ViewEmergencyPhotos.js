import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, Image, TextInput, FlatList, ActivityIndicator } from 'react-native'
import { Colors, Fonts } from '../common/ConstantStyles'
import PropTypes from 'prop-types';
import Snackbar from 'react-native-snackbar';
import NoDataFound from '../common/NoDataFound';

const ViewEmergencyPhotos = ({ navigation }) => {

    const [workImageList, setWorkImageList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        getAttachments();

    }, []);

    const getAttachments = async () => {

        setLoading(true);

        let toInput = {
            works_id: 4774,
        };

        await fetch(`https://shrikarniinfra.in/app/work/photolist`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        }).then((response) => response.json())
            .then((response) => {
                setLoading(false);
                if (response.model) {
                    setWorkImageList(response.model);
                }
            }).catch((error) => {
                setLoading(false);
                console.error('EmergencyInventory GET ATTACHMENTS There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
            })
    }

    return (
        <View>

            {loading ?
                <ActivityIndicator />
                :
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
            }

        </View>

    );
}

ViewEmergencyPhotos.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default ViewEmergencyPhotos

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