import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Colors } from '../common/ConstantStyles';
import PropTypes from 'prop-types';

const SplashScreen = ({ navigation }) => {

    setTimeout(() => { navigation.navigate('Login'); }, 1500);

    return (
        <View style={styles.container}>
            <View style={styles.imagecenter}>
                <Image style={styles.applogo} source={require('../assets/images/sipl_logo.png')} />
            </View>
        </View>
    );
}

SplashScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    imagecenter: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    applogo: {
        backgroundColor: Colors.white,
        width: 250,
        height: 200
    }
});