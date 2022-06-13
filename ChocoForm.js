import React, { useState } from 'react';
import { Text, View } from 'react-native';
import ChocoConfig from './ChocoConfig';

import Input from './Input/Input';

import * as InputFunctions from './Input/InputFunctions';

const ChocoForm = (props) => {
    const formElementsArray = [];
    let generalError = null;

    ChocoConfig.lang = props.lang;

    if (props.form.generalError && props.form.generalError.show) {
        generalError = (<Text style={{ fontSize: 18, color: "red", marginBottom: 15, textAlign: "center" }}>{props.form.generalError.text}</Text>)
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
            inputStyle={props.inputStyle}
            inputStyleTouched={props.inputStyleTouched}
            inputStyleBlured={props.inputStyleBlured}
            inputChangedHandler={(event) => {
                const updatedForm = InputFunctions.inputChangedHandler(form, event, formElement.id);

                props.onFormChange(updatedForm);
            }}
            {...formElement}
        />
    ));

    return (
        <View style={{ padding: 15 }}>
            {form}
            {generalError}
        </View>
    );
}

export default ChocoForm;