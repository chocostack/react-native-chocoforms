import React, { useState } from 'react';
import TAuth from './../../../Translations/Auth/TAuth';
import { Button, CheckBox, Linking, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import Styles from '../../../../Styles';
import CCText from '../../NativeComponents/CCText';
import AppConfig from '../../../AppConfig';

import DateTimePicker from '@react-native-community/datetimepicker';
import PrettyCheckbox from '../Radio/PrettyCheckbox';
import { mask, MaskedTextInput } from 'react-native-mask-text';
import CurrencyInput from './CurrencyInput';
import TimeInput from './TimeInput';
import OptionModal from '../../Modal/OptionModal';

const Input = (props) => {

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(Platform.OS == 'ios');
    const [touched, setTouched] = useState(false);
    const [blured, setBlured] = useState(false);

    let inputElement = null;

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

    switch (props.config.elementType) {
        case 'currency':
            inputElement = <CurrencyInput
                inputChangedHandler={props.inputChangedHandler}
                config={props.config}
                {...props.config.elementConfig}
            />
            break;
        case 'time':
            inputElement = <TimeInput
                inputChangedHandler={props.inputChangedHandler}
                config={props.config}
                {...props.config.elementConfig}
            />
            break;
        case 'input':
            inputElement = <TextInput
                onChange={props.inputChangedHandler}
                onFocus={onFocus} onBlur={onBlur}
                {...props.config.elementConfig}
                style={{ fontSize: 20, ...inputStyle, ...Styles.textColor, ...props.config.style }}
                value={props.config.value}
            />
            break;
        case 'date':
            const maxDate = new Date();
            maxDate.setFullYear(new Date().getFullYear() - 12);
            
            const dateValue = props.config.dateObject ? new Date(props.config.dateObject) : maxDate;

            inputElement = <View>
                {!isDatePickerOpen ? <TouchableWithoutFeedback onPress={() => {
                    setIsDatePickerOpen(true);
                }}>
                    <View style={{ ...inputBorder }}>
                        <CCText style={{ fontSize: 20, ...inputStyle, borderBottomWidth: 0, ...Styles.textColor, ...props.config.style }}>
                            {props.config.value}
                        </CCText>
                    </View>
                </TouchableWithoutFeedback>
                : null }
                {isDatePickerOpen && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={dateValue}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setIsDatePickerOpen(false);

                            if (selectedDate)
                                props.inputChangedHandler(selectedDate, props.id);
                        }}
                    />
                )}
            </View>
            break;
        case 'select':
            const [isVisible, setIsVisible] = useState(false);
            const [selected, setSelected] = useState(props.config.value);

            const toggle = () => {
                setIsVisible(!isVisible);
            }

            inputElement = <View>
                <TouchableWithoutFeedback onPress={toggle}>
                    <View>
                        <CCText style={{ fontSize: 20, ...inputStyle, ...Styles.textColor, ...props.config.style }}>
                            {props.config.text}
                        </CCText>
                    </View>
                </TouchableWithoutFeedback>
                <OptionModal
                    isVisible={isVisible}
                    toggleModal={toggle}
                    options={props.config.options}
                    selected={selected}
                    callback={(item) => {
                        const obj = {
                            nativeEvent: {
                                id: item.id,
                                text: item.text,
                            }
                        }

                        props.inputChangedHandler(obj);

                        setSelected(item.id);
                    }}
                />
            </View>
            break;
        case 'tos':
            inputElement = <View style={{ ...Styles.flexDirectionRow }}>
                <TouchableWithoutFeedback onPress={props.inputChangedHandler}>
                    <View style={{ padding: 4, ...Styles.flexDirectionRow }}>
                        <PrettyCheckbox
                            selected={props.config.value}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <CCText style={{ marginLeft: 5, marginTop: 5 }}>
                    <Text onPress={props.inputChangedHandler}>
                        {TAuth[AppConfig.lang].TERMS_OF_SERVICE}
                    </Text>
                    <Text style={{ ...Styles.themeColor }} onPress={() => Linking.openURL(AppConfig.URL + '/TermsOfService')}>
                        {TAuth[AppConfig.lang].TERMS_OF_SERVICE_LINK}
                    </Text>
                </CCText>
            </View>
            break;
    }

    return (
        <View>
            {props.config.label ? <Text style={{ ...Styles.themeColor }}>{props.config.label}</Text> : null}
            {inputElement}
            <Text style={{ color: "red" }}>{props.errorMessage}</Text>
        </View>
    );
}

export default Input;