// @ts-ignore
import { useState, useEffect, useRef } from 'react';

// @ts-ignore
import { Text, TextInput, TouchableWithoutFeedback, View, Platform } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import SelectDropdown from 'react-native-select-dropdown'

import * as MaskFunctions from '@chocostack/maskifier';
import ChocoConfig from "../../ChocoConfig";

const Input = (props) => {

    const inputRef = useRef();

    // On iOS, the DateTimePicker is shown inline, on Android it's a modal
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
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
            // Use current date as default if no default date is specified
            const defaultDate = new Date();

            // If defaultDate is specified in config, use it
            if (props.config.defaultDate) {
                if (typeof props.config.defaultDate === 'string') {
                    defaultDate.setTime(Date.parse(props.config.defaultDate));
                } else if (props.config.defaultDate instanceof Date) {
                    defaultDate.setTime(props.config.defaultDate.getTime());
                } else if (typeof props.config.defaultDate === 'number') {
                    // If it's a number, assume it's years to subtract from current date
                    defaultDate.setFullYear(defaultDate.getFullYear() - props.config.defaultDate);
                }
            }

            const dateValue = props.config.dateObject ? new Date(props.config.dateObject) : defaultDate;

            inputElement = <View>
                {/* Always show the text field that displays the selected date */}
                <TouchableWithoutFeedback onPress={() => {
                    setIsDatePickerOpen(true);
                }}>
                    <View style={{ ...inputBorder }}>
                        <Text style={{ fontSize: 20, ...inputStyle, borderBottomWidth: 0 }}>
                            {props.config.value}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>

                {/* Show the DateTimePicker when isDatePickerOpen is true */}
                {isDatePickerOpen && (
                    <>
                        {Platform.OS === 'ios' && (
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
                                <TouchableOpacity 
                                    onPress={() => setIsDatePickerOpen(false)}
                                    style={{ 
                                        paddingVertical: 8, 
                                        paddingHorizontal: 12, 
                                        backgroundColor: ChocoConfig.mainColor || '#007AFF',
                                        borderRadius: 5
                                    }}
                                >
                                    <Text style={{ color: 'white', fontWeight: '600' }}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={dateValue}
                            mode={'date'}
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selectedDate) => {
                                // On Android, the picker is automatically dismissed when a date is selected
                                // On iOS, we need to keep it open until the user explicitly dismisses it
                                if (Platform.OS === 'android') {
                                    setIsDatePickerOpen(false);
                                }

                                if (selectedDate) {
                                    props.inputChangedHandler(selectedDate, props.id);
                                }
                            }}
                            style={{ width: '100%' }}
                        />
                    </>
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
