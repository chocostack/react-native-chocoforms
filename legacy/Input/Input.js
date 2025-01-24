import React, { useState, useEffect, useRef } from 'react';

import { Linking, Text, TextInput, TouchableWithoutFeedback, View, Platform } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import SelectDropdown from 'react-native-select-dropdown'

import * as MaskFunctions from '@chocostack/maskifier';
import ChocoConfig from "../../ChocoConfig";

const Input = (props) => {

    const inputRef = useRef();

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(Platform.OS == 'ios');
    const [touched, setTouched] = useState(false);
    const [blured, setBlured] = useState(false);

    let inputElement = null;

    let labelStyle = {  };
    let inputBorder = { borderBottomWidth: 1, borderBottomColor: '#CCCCCC', ...ChocoConfig.inputStyle, ...props.inputStyle };

    if (touched) {
        labelStyle = { color: ChocoConfig.mainColor }
        inputBorder = { borderBottomWidth: 1, borderBottomColor: ChocoConfig.mainColor, ...ChocoConfig.inputStyle, ...props.inputStyle, ...ChocoConfig.inputStyleTouched, ...props.inputStyleTouched };
    }

    if (blured) {
        labelStyle = {}
        inputBorder = { borderBottomWidth: 1, borderBottomColor: '#CCCCCC', ...ChocoConfig.inputStyle, ...props.inputStyle, ...ChocoConfig.inputStyleBlurred, ...props.inputStyleBlured };
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

    useEffect(() => {
        if(props.config.reset && inputRef && inputRef.current){
            inputRef.current.reset();
        }

    }, [props.config.reset]);

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
            const valueIndex = props.config.options.findIndex(i => i.id === props.config.value || i.value === props.config.value)

            inputElement = <View>
                <SelectDropdown
                    ref={inputRef}
                    buttonStyle={{ width: '100%' }}
                    data={props.config.options}
                    defaultValueByIndex={valueIndex}
                    onSelect={(item, index) => {
                        const id = item.id ? item.id : item.value;
                        const text = item.text ? item.text : item.label;

                        const obj = {
                            nativeEvent: {
                                id: id,
                                text: text,
                                //For compatibility with some code
                                value: id,
                                label: text
                            }
                        }

                        props.inputChangedHandler(obj);

                        if (props.config.onChangeCallback)
                            props.config.onChangeCallback(item);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        return selectedItem.text
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        return item.text
                    }}
                />
            </View>
            break;
    }

    return (
        <View style={{ marginTop: 3 }}>
            {props.config.label ? <Text style={{ fontWeight: 'bold', ...labelStyle, ...props.labelStyle }}>{props.config.label}</Text> : null}
            {inputElement}
            <Text style={{ color: "red" }}>{props.config.errorMessage}</Text>
        </View>
    );
}

export default Input;