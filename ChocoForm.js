import React, { useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
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
                const updatedForm = InputFunctions.inputChangedHandler(props.form, event, formElement.id);

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
            <Modal
                transparent={true}
                visible={this.props.isOpen}
                onRequestClose={this.props.toggle}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.6)'
                }}>
                    <View style={{
                        width: 300,
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 15,
                        paddingBottom: 0
                    }}>
                        <ScrollView keyboardShouldPersistTaps={'always'} style={{ minHeight: 100 }}>
                            <ChocoForm
                                form={this.props.form}
                                onFormChange={this.props.onFormChange}
                            />
                            {this.state.loading ?
                                <ActivityIndicator size={52} color={"black"} style={{ marginBottom: 15 }} />
                                :
                                <View style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row'
                                }}>
                                    <TouchableNativeFeedback onPress={this.props.toggle}>
                                        <View style={{ padding: 20 }}>
                                            <Text style={{ fontSize: 20, color: 'black' }}>
                                                {this.props.cancelText}
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                    <TouchableNativeFeedback onPress={async () => {
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
                                        <View style={{ padding: 20 }}>
                                            <Text style={{ fontSize: 20, color: 'black', ...disabledStyle, }}>
                                                {this.props.confirmText}
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                            }
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    }

}