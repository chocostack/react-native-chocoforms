import React, { useState } from 'react';

import { Linking, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
;
import OptionModal from '@chocostack/react-native-options-modal';

import * as MaskFunctions from '@chocostack/maskifier';

const Input = (props) => {

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(Platform.OS == 'ios');
    const [touched, setTouched] = useState(false);
    const [blured, setBlured] = useState(false);

    let inputElement = null;

    let inputBorder = { borderBottomWidth: 1, borderBottomColor: '#CCCCCC', ...props.inputStyle };

    if (touched) {
        inputBorder = { borderBottomWidth: 1, borderBottomColor: 'blue', ...props.inputStyle, ...props.inputStyleTouched };
    }

    if (blured) {
        inputBorder = { borderBottomWidth: 1, borderBottomColor: 'purple', ...props.inputStyle, ...props.inputStyleBlured };
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
            inputElement = <TextInput
                onChangeText={(text) => {
                    const event = {
                        unMaskedValue: MaskFunctions.unMaskMoney(text)
                    }

                    props.inputChangedHandler(event, props.id);
                }}
                onFocus={onFocus} onBlur={onBlur}
                {...props.config.elementConfig}
                style={{ fontSize: 20, ...inputStyle }}
                value={MaskFunctions.maskMoney(props.config.value)}
                keyboardType="numeric"
            />
            break;
        case 'time':
            inputElement = <TextInput
                    onChangeText={(text) => {
                        const event = {
                            nativeEvent: {
                                text: text
                            }
                        }

                        props.inputChangedHandler(event, props.id);
                    }}
                    onFocus={onFocus} onBlur={onBlur}
                    {...props.config.elementConfig}
                    style={{ fontSize: 20, ...inputStyle }}
                    value={MaskFunctions.maskTime(props.config.value)}
                    keyboardType="numeric"
                />
            break;
        case 'input':
            inputElement = <TextInput
                onChange={props.inputChangedHandler}
                onFocus={onFocus} onBlur={onBlur}
                {...props.config.elementConfig}
                style={{ fontSize: 20, ...inputStyle }}
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
                        <Text style={{ fontSize: 20, ...inputStyle, borderBottomWidth: 0 }}>
                            {props.config.value}
                        </Text>
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
                        <Text style={{ fontSize: 20, ...inputStyle }}>
                            {props.config.text}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <OptionModal
                    title={props.config.label}
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
    }

    return (
        <View>
            {props.config.label ? <Text style={{ ...props.labelStyle }}>{props.config.label}</Text> : null}
            {inputElement}
            <Text style={{ color: "red" }}>{props.config.errorMessage}</Text>
        </View>
    );
}

export default Input;