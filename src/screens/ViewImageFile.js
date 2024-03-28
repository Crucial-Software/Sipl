import React, { useState } from 'react';
import { View, Dimensions, Modal, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import PropTypes from 'prop-types';

const ViewImageFile = ({ route, navigation }) => {

    const { file } = route.params
    const [isModalVisible, setIsModalVisible] = useState(true);

    const image = [{ url: `${file}` }];

    const closeModal = () => {
        if (isModalVisible) {
            setIsModalVisible(false)
        }
    }

    return (
        <View>
            <Modal transparent visible={isModalVisible}>

                <ImageViewer
                    imageUrls={image}
                    enableSwipeDown
                    onSwipeDown={() => {
                        closeModal();
                        navigation.goBack();
                    }}
                />
            </Modal>

        </View>
    );

}

ViewImageFile.propTypes = {
    route: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
};

export default ViewImageFile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pdf: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        marginBottom: 60
    }
});
