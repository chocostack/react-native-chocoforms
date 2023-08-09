import React, { Component } from 'react';
import { Text, View, ActivityIndicator, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

import Modal from "react-native-modal";

import ChocoConfig from './ChocoConfig';

import Input from './Input/Input';

import * as InputFunctions from './Input/InputFunctions';

const ChocoForm = (props) => {
    const formElementsArray = [];
    let generalError = null;

    if (props.lang)
        ChocoConfig.lang = props.lang;

    if (props.form.generalError && props.form.generalError.show) {
        generalError = (<Text style={{ fontSize: 18, color: "red", marginBottom: 15, textAlign: "center" }}>{props.form.generalError.text}</Text>)
    }

    for (let key in props.form.controls) {
        formElementsArray.push({
            id: key,
            config: props.form.controls[key],
        });
    }

    const form = formElementsArray.map(formElement => (
        <Input
            key={formElement.id}
            labelStyle={props.labelStyle}
            inputStyle={props.inputStyle}
            inputStyleTouched={props.inputStyleTouched}
            inputStyleBlured={props.inputStyleBlured}
            inputChangedHandler={(event) => {
                const updatedForm = InputFunctions.inputChangedHandler(props.form, event, formElement.id);

                props.onFormChange(updatedForm);
            }}
            {...formElement}
        />
    ));

    return (
        <View style={{ padding: 15, ...props.containerStyle }}>
            {form}
            {generalError}
        </View>
    );
}

export default ChocoForm;

export const ChocoInput = (props) => {

    return <Input
        key={props.id}
        labelStyle={props.labelStyle}
        inputStyle={props.inputStyle}
        inputStyleTouched={props.inputStyleTouched}
        inputStyleBlured={props.inputStyleBlured}
        inputChangedHandler={(event) => {
            const updatedControlElement = InputFunctions.inputChanged(props.control, event);

            props.inputChangedHandler(updatedControlElement);
        }}
        config={props.control}
    />;
}

export class FormModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let shouldUpdate = false;

        if (!this.props)
            shouldUpdate = true;
        else if (this.props.isOpen != nextProps.isOpen) {
            shouldUpdate = true;
        } else if (this.props.isOpen) {
            shouldUpdate = true;
        }


        return shouldUpdate;
    }

    render() {
        let disabledStyle = {};

        if (!this.props.form.isValidForm) {
            disabledStyle = {
                opacity: .5
            }
        }

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <Modal
                    hideModalContentWhileAnimating={true}
                    hasBackdrop={true}
                    backdropColor={"black"}
                    backdropOpacity={.7}
                    useNativeDriver={true}
                    animationIn={"zoomIn"}
                    animationInTiming={200}
                    isVisible={this.props.isOpen}
                    onRequestClose={this.props.toggle}
                    onBackdropPress={this.props.toggle}
                >
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 8,
                        padding: 15,
                        paddingBottom: 0
                    }}>
                        <ScrollView keyboardShouldPersistTaps={'always'} style={{ minHeight: 100 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: ChocoConfig.mainColor }}>
                                {this.props.title}
                            </Text>
                            <ChocoForm
                                form={this.props.form}
                                onFormChange={this.props.onFormChange}
                            />
                            {this.state.loading ?
                                <ActivityIndicator size={52} color={"black"} style={{ marginBottom: 15 }} />
                                :
                                <View style={{
                                    justifyContent: 'flex-end',
                                    flexDirection: 'row',
                                    marginBottom: 15
                                }}>
                                    <TouchableOpacity onPress={this.props.toggle}>
                                        <View style={{ padding: 10, borderRadius: 6, }}>
                                            <Text style={{ fontSize: 20, color: 'black' }}>
                                                {this.props.cancelText}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{ width: 7 }}></View>
                                    <TouchableOpacity onPress={async () => {
                                        if (this.props.form.isValidForm) {
                                            this.setState({
                                                loading: true
                                            });

                                            await this.props.confirmFunction();

                                            this.setState({
                                                loading: false
                                            });
                                        }
                                    }}>
                                        <View style={{ padding: 10, borderRadius: 6, backgroundColor: ChocoConfig.mainColor,  ...disabledStyle }}>
                                            <Text style={{ fontSize: 20, color: 'white', }}>
                                                {this.props.confirmText}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                        </ScrollView>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        );
    }

}