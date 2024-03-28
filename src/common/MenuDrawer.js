import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Colors } from './ConstantStyles'
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

const MenuDrawer = ({navigation}) => {

    return (

        <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon name='menu' type='material-icon' size={25} iconStyle={{ marginStart: 20 }} color={Colors.white} />
        </TouchableOpacity>

    )
}
MenuDrawer.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default MenuDrawer