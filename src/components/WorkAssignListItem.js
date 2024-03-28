import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Colors, FontSize } from '../common/ConstantStyles'
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import { API_BASE } from '../setupProxy';
import Snackbar from 'react-native-snackbar';

const WorkAssignListItem = ({ item, index, functionGetWork }) => {

    const removeWork = () => {

        console.log("item id: " + item.id);

        Alert.alert('Remove', 'Are you sure you want to remove this?', [
            {
                text: 'No',
                onPress: () => console.log('Cancel Pressed. Not Removed'),
                style: 'cancel',
            },
            {
                text: 'Yes', onPress: () => {

                    console.log('Yes Pressed');

                    let toInput = {
                        workid: item.id,
                    };
    
                    fetch(`${API_BASE}/app/work/removework`, {
                        method: "POST",
                        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                        body: JSON.stringify(toInput)
                    })
                        .then((response) => response.json())
                        .then((response) => {
                            Snackbar.show({ text: '' + response.message, duration: Snackbar.LENGTH_SHORT });
                            if(response.code === 1){
                                callParentFunction();
                            }
                            
                        })
                        .catch((error) => {
                            console.error('REMOVE WORK There was an error!', error);
                            Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })
                        })
                },
                
            }
        ]);

    }

    const callParentFunction = () => {
        functionGetWork();
    }

    return (
        <View>

            <View style={styles.itemContent}>
                <Text style={styles.tblIndexContent} >{index + 1}</Text>
                <Text style={styles.tblOtherContent} >{item.empname}</Text>
                <Text style={styles.tblOtherContent} >{moment(item.assigneddatetime).format("DD-MMM-YYYY")}</Text>
                <Text style={styles.tblOtherContent} >{item.status}</Text>
                <View style={styles.tblIndexContent} >
                    <TouchableOpacity onPress={() => { removeWork() }}>
                        <Icon name="close" type="material-icons" size={20} color={Colors.red} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

WorkAssignListItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    functionGetWork: PropTypes.func.isRequired,
};

export default WorkAssignListItem

const styles = StyleSheet.create({
    itemContent: {
        flex: 1,
        padding: 5,
        backgroundColor: Colors.white,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    tblIndexContent: {
        flex: 0.5,
        color: Colors.black,
        fontSize: FontSize.smallMedium,
    },
    tblOtherContent: {
        flex: 1.5,
        color: Colors.black,
        fontSize: FontSize.smallMedium,
    },
});