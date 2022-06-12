import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Modal, TouchableNativeFeedback, View } from 'react-native';
import Styles from '../../../../Styles';

const PrettyCheckbox = (props) => {
    let color = props.selected ? Styles.themeColor.color : '#999';
    let backgroundColor = props.selected ? Styles.themeColor.color : 'white';

    return (
        <View style={[{
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: color,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: backgroundColor
        }, props.style]}>
            {
                props.selected ?
                    <FontAwesomeIcon
                        icon={faCheck}
                        color={'white'}
                    />
                    : null
            }
        </View>
    );
};

export default PrettyCheckbox;