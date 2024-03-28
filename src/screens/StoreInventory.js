import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { Colors, FontSize } from '../common/ConstantStyles';
import { ScrollView } from "react-native-gesture-handler";
import { API_BASE } from '../setupProxy';
import { SearchBar } from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoDataFound from '../common/NoDataFound';
import StoreStockListItem from '../components/StoreStockListItem';

const StoreInventory = ({ navigation }) => {

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [stockList, setStockList] = useState([]);
    const [filterStockList, setFilterStockList] = useState([]);

    useEffect(() => {

        getData();

    }, []);

    const getData = async () => {

        await AsyncStorage.getItem('userEmpDetails')
            .then(stringifiedEmpDetails => {

                const parsedEmpDetails = JSON.parse(stringifiedEmpDetails);

                if (!parsedEmpDetails || typeof parsedEmpDetails !== 'object') return;

                getStock(parsedEmpDetails[0].locations_id);

            })
            .catch(err => {
                console.warn('Error restoring Emp Details from async');
                console.warn(err);
            });

    };

    const getStock = async (locId) => {

        setLoading(true);

        let toInput = {
            locations_id: locId,
        };

        await fetch(`${API_BASE}/app/products/storestock`, {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toInput)
        })
            .then((response) => response.json())
            .then((response) => {

                setLoading(false);

                if (response) {
                    setStockList(response.model);
                    setFilterStockList(response.model);
                } else {
                    Snackbar.show({ text: 'Unable to load data', duration: Snackbar.LENGTH_SHORT })
                }

            })
            .catch((error) => {
                setLoading(false);
                console.error('STOCK INVENTORY There was an error!', error);
                Snackbar.show({ text: 'Error Occured. Please Try again. ' + error, duration: Snackbar.LENGTH_SHORT })

            })

    }

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = stockList.filter(function (item) {
                const itemData = item.product.name ? item.product.name.toUpperCase() + " " + item.product.item_code : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilterStockList(newData);
            setSearch(text);
        } else {
            setFilterStockList(stockList);
            setSearch(text);
        }
    };

    return (
        <View style={styles.container}>

            {loading ?
                <ActivityIndicator />
                :

                <View style={{ flex: 1 }}>

                    <SearchBar
                        round
                        lightTheme
                        searchIcon={{ size: 24 }}
                        onChangeText={(text) => searchFilterFunction(text)}
                        onClear={(text) => searchFilterFunction('')}
                        placeholder="Search Here..."
                        value={search}
                    />

                    <View style={{ flex: 1 }}>

                        <View style={styles.itemContentHeading}>
                            <Text style={{ flex: 0.5, fontWeight: "bold", color: Colors.black, fontSize: FontSize.smallMedium, }} >#</Text>
                            <Text style={{ flex: 3, fontWeight: "bold", color: Colors.black, fontSize: FontSize.smallMedium, }} >Item Name</Text>
                            <Text style={{ flex: 1.5, fontWeight: "bold", color: Colors.black, fontSize: FontSize.smallMedium, }} >Item Code</Text>
                            <Text style={{ flex: 1.25, fontWeight: "bold", color: Colors.black, fontSize: FontSize.smallMedium, textAlign: "right" }} >Total Stock</Text>
                        </View>

                        <ScrollView contentContainerStyle={{ width: '100%' }} horizontal={true}>
                            <FlatList
                                data={filterStockList}
                                keyExtractor={(item, index) => { return index.toString(); }}
                                renderItem={({ item, index }) => <StoreStockListItem item={item} index={index} />}
                                showsHorizontalScrollIndicator={false}
                                ListEmptyComponent={<NoDataFound />}
                            />
                        </ScrollView>

                    </View>

                </View>
            }

        </View>
    )
}

StoreInventory.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default StoreInventory

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    itemContentHeading: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        backgroundColor: Colors.lightGrey,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    itemContent: {
        flex: 1,
        padding: 5,
        backgroundColor: Colors.white,
        flexDirection: "row",
        justifyContent: "space-between"
    },

});