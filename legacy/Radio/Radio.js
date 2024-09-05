import React from 'react';
import { Modal, TouchableNativeFeedback, View } from 'react-native';
import Styles from '../../../../Styles';

const Radio = (props) => {
    color = props.selected ? Styles.themeColor.color : '#999';

    return (
        <View style={[{
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: color,
            alignItems: 'center',
            justifyContent: 'center',
        }, props.style]}>
            {
                props.selected ?
                    <View style={{
                        height: 12,
                        width: 12,
                        borderRadius: 6,
                        backgroundColor: color,
                    }} />
                    : null
            }
        </View>
    );
};

export default Radio;