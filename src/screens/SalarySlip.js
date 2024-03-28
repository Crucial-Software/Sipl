import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Colors, FontSize, Fonts } from '../common/ConstantStyles';
import { API_BASE } from '../setupProxy';
import NoDataFound from '../common/NoDataFound';
import PropTypes from 'prop-types';

const SalarySlip = ({ navigation }) => {

    const [loading, setLoading] = useState(true);
    const [salarySlipList, setSalarySlipList] = useState([]);

    useEffect(() => {

        setLoading(false);

        //getSalarySlips();

    }, []);

    const getSalarySlips = async () => {

        try {
            const response = await fetch(`${API_BASE}/api/category.php`);
            const data = await response.json();
            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            setSalarySlipList(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    }

    const SalarySlipListItem = ({ item, index }) => {

        return (
            <View>
                <TouchableOpacity onPress={() => { navigation.navigate("Salary Slip Details", { salarySlipId: item.id }) }} style={styles.itemContainer}>

                    <View style={styles.itemContent}>
                        <Text style={styles.itemTextHeading} >{item.yearmonth}</Text>
                    </View>

                </TouchableOpacity>
            </View>

        );
    };

    return (
        <View style={styles.container}>

            {loading ?
                <ActivityIndicator />
                :
                <FlatList
                    data={salarySlipData}
                    keyExtractor={(item, index) => { return index.toString(); }}
                    renderItem={({ item, index }) => <SalarySlipListItem item={item} index={index} />}
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={<NoDataFound />}
                />
            }

        </View>
    )
}

SalarySlip.propTypes = {
    navigation: PropTypes.object.isRequired,
  };

export default SalarySlip

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    itemContainer: {
        borderRadius: 5,
        backgroundColor: Colors.white,
        shadowColor: Colors.darkGrey,
        elevation: 10,
        margin: 10,
        borderWidth: 0.5,
        borderColor: Colors.primary,
    },
    itemContent: {
        padding: 15,
    },
    itemTextHeading: {
        color: Colors.black,
        fontFamily: Fonts.bold,
        fontWeight: "bold",
        fontSize: FontSize.medium,
    },

});

const salarySlipData = [
    { id: 1, yearmonth: "Sep-2023", },
    { id: 2, yearmonth: "Oct-2023", },
    { id: 3, yearmonth: "Nov-2023", },
    { id: 4, yearmonth: "Dec-2023", },
    { id: 5, yearmonth: "Jan-2023", },
]
