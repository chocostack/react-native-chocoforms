import React, { useState } from 'react';
import { Text, TouchableNativeFeedback, View } from 'react-native';
import Styles from '../../../Styles';
import Input from './Input/Input';

const Form = (props) => {
    const formElementsArray = [];
    let saveButton = null;
    let cancelButton = null;
    let generalError = null;

    if (props.form.generalError && props.form.generalError.show) {
        generalError = (<Text style={{ fontSize: 18, color: "red", marginBottom: 15, textAlign: "center" }}>{props.form.generalError.text}</Text>)
    }

    if (props.form.saveButton) {
        let disabledStyles = {};
        if (props.form.saveButton.disabled) {
            disabledStyles = {
                opacity: .4
            }
        }

        if (props.form.cancelButton) {
            cancelButton = <TouchableNativeFeedback onPress={props.onCancel}>
                <View style={{ ...Styles.btnInvisible }}>
                    <Text style={{ fontSize: 18, textAlign: 'center', ...Styles.themeColor }}>
                        {props.form.cancelButton.text}
                    </Text>
                </View>
            </TouchableNativeFeedback>;
        }

        if (!props.form.saveButton.hide) {
            saveButton = <TouchableNativeFeedback onPress={props.onClick} disabled={props.form.saveButton.disabled}>
                <View style={{ ...Styles.btnInvisible, ...disabledStyles }}>
                    <Text style={{ fontSize: 18, ...Styles.themeColor, textAlign: 'center' }}>
                        {props.form.saveButton.text}
                    </Text>
                </View>
            </TouchableNativeFeedback>;
        }
    }

    for (let key in props.form.controls) {
        formElementsArray.push({
            id: key,
            config: props.form.controls[key],
            className: props.form.controls[key].className,
            name: props.form.controls[key].name,
            errorMessage: props.form.controls[key].errorMessage
        });
    }

    const form = formElementsArray.map(formElement => (
        <Input
            key={formElement.id}
            inputChangedHandler={(event) => props.inputChangedHandler(event, formElement.id)}
            {...formElement} />
    ));

    return (
        <View style={{ ...Styles.sasPadding }}>
            {form}
            {generalError}
            {props.form.saveButton && !props.form.saveButton.hide ?
                <View style={{ marginTop: 15, justifyContent: 'space-evenly', ...Styles.flexDirectionRow }}>
                    {cancelButton}
                    {saveButton}
                </View>
                :
                null}

        </View>
    );
}

export default Form;