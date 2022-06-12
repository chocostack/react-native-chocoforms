import React, { useState } from 'react';
import TAuth from './../../../Translations/Auth/TAuth';
import { TextInput, View } from 'react-native';
import Styles from '../../../../Styles';
import CCText from '../../NativeComponents/CCText';
import AppConfig from '../../../AppConfig';

import * as MaskFunctions from './../../../MaskFunctions';

const CurrencyInput = (props) => {
    const [touched, setTouched] = useState(false);
    const [blured, setBlured] = useState(false);

    let inputBorder = { borderBottomWidth: 1, borderBottomColor: '#CCCCCC' };

    if (touched) {
        inputBorder = Styles.themeInputBorder;
    }

    if (blured) {
        inputBorder = Styles.secondaryThemeInputBorder;
    }

    let inputStyle = { paddingTop: 0, paddingBottom: 7, ...inputBorder };

    const onFocus = () => {
        if (!touched) {
            setBlured(false);
            setTouched(true);
        }
    }

    const onBlur = () => {
        if (touched) {
            setTouched(false);
            setBlured(true);
        }
    }

    return (
        <View>
            <TextInput
                onChangeText={(text) => {
                    const event = {
                        unMaskedValue: MaskFunctions.unMaskMoney(text)
                    }

                    props.inputChangedHandler(event, props.id);
                }}
                onFocus={onFocus} onBlur={onBlur}
                {...props.config.elementConfig}
                style={{ fontSize: 20, ...inputStyle, ...Styles.textColor, ...props.config.style }}
                value={MaskFunctions.maskMoney(props.config.value)}
                keyboardType="numeric"
            />
        </View>
    );
}

export default CurrencyInput;