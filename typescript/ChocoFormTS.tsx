﻿import ChocoConfig from '../ChocoConfig';

import Input from './Input/Input';

import * as InputFunctions from './Input/InputFunctions';
// @ts-ignore
import React, {Component} from "react";
import ChocoForm from "./models/ChocoForm";
import {
    Text,
    ActivityIndicator,
    Modal,
    ScrollView,
    View,
    TouchableOpacity
// @ts-ignore
} from "react-native";

interface ChocoFormProps {
    lang?: string | null | undefined;
    containerClassName?: string | null | undefined;
    inputStyle?: any;
    inputStyleTouched?: any;
    inputStyleBlured?: any;
    form: ChocoForm;
    onFormChange: (form: ChocoForm) => void;
}

const ChocoFormTS: React.FC<ChocoFormProps> = ({
                                                   lang = undefined,
                                                   containerClassName = "",
                                                   inputStyle = undefined,
                                                   inputStyleTouched = undefined,
                                                   inputStyleBlured = undefined,
                                                   form,
                                                   onFormChange
                                               }) => {

    const formElementsArray = new Array<any>();
    let generalError = <div></div>;

    if (lang)
        ChocoConfig.lang = lang;

    if (form.generalError && form.generalError.show) {
        generalError = (<div style={{
            fontSize: 18,
            color: "red",
            marginBottom: 15,
            textAlign: "center"
        }}>{form.generalError.text}</div>)
    }

    for (let key in form.controls) {
        formElementsArray.push({
            id: key,
            config: form.controls[key],
            className: form.controls[key].className,
            name: form.controls[key].name,
            errorMessage: form.controls[key].errorMessage
        });
    }

    const formComponent = formElementsArray.map(formElement => (
        <Input
            key={formElement.id}
            labelStyle={{fontWeight: 'bold'}}
            inputStyle={inputStyle}
            inputStyleTouched={inputStyleTouched}
            inputStyleBlured={inputStyleBlured}
            inputChangedHandler={(event) => {
                const updatedForm = InputFunctions.inputChangedHandler(form, event, formElement.id);

                onFormChange(updatedForm);
            }}
            {...formElement}
        />
    ));

    return (
        <div className={containerClassName + ' row'}>
            {formComponent}
            {generalError}
        </div>
    );
}

export default ChocoFormTS;


interface FormModalTSProps {
    isOpen: boolean;
    toggle: () => void;
    title?: string;
    form: ChocoForm;
    onFormChange: (form: any) => void;
    cancelText: string;
    confirmText: string;
    confirmFunction: () => Promise<void>;
}

interface FormModalTSState {
    loading: boolean;
}

export class FormModalTS extends Component<FormModalTSProps, FormModalTSState> {

    constructor(props) {
        super(props);

        // @ts-ignore
        this.state = {
            loading: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let shouldUpdate = false;

        // @ts-ignore
        if (!this.props)
            shouldUpdate = true;
        // @ts-ignore
        else if (this.props.isOpen != nextProps.isOpen) {
            shouldUpdate = true;
            // @ts-ignore
        } else if (this.props.isOpen) {
            shouldUpdate = true;
        }


        return shouldUpdate;
    }

    render() {
        return (
            <Modal
                transparent={true}
                // @ts-ignore
                visible={this.props.isOpen}
                // @ts-ignore
                onRequestClose={this.props.toggle}
                hideHeader={true}
                footer={
                    // @ts-ignore
                    this.state.loading ?
                        <ActivityIndicator style={{marginRight: 7}}/>
                        :
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <TouchableOpacity
                                // @ts-ignore
                                onPress={this.props.toggle}
                            >
                                <View style={{padding: 10, borderRadius: 6,}}>
                                    <Text style={{fontSize: 20, color: 'black'}}>
                                        {
                                            // @ts-ignore
                                            this.props.cancelText
                                        }
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{width: 7}}></View>
                            <TouchableOpacity
                                // @ts-ignore
                                onPress={async () => {
                                    // @ts-ignore
                                    if (this.props.form.isValidForm) {
                                        // @ts-ignore
                                        this.setState({
                                            loading: true
                                        });

                                        // @ts-ignore
                                        await this.props.confirmFunction();

                                        // @ts-ignore
                                        this.setState({
                                            loading: false
                                        });
                                    }
                                }}
                            >
                                <View style={{
                                    padding: 10,
                                    borderRadius: 6,
                                    backgroundColor: ChocoConfig.mainColor,
                                    // @ts-ignore
                                    ...disabledStyle
                                }}>
                                    <Text style={{fontSize: 20, color: 'white',}}>
                                        {
                                            // @ts-ignore
                                            this.props.confirmText
                                        }
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                }
            >
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                    <View style={{
                        borderRadius: 16,
                        paddingBottom: 0
                    }}>
                        <ScrollView keyboardShouldPersistTaps={'always'} style={{minHeight: 100}}>
                            {// @ts-ignore
                                this.props.title ?
                                    <h1
                                        style={{
                                            marginBottom: 30,
                                            fontSize: '2.5rem'
                                        }}
                                    >
                                        {// @ts-ignore
                                            this.props.title
                                        }
                                    </h1>
                                    :
                                    null
                            }
                            <ChocoFormTS
                                // @ts-ignore
                                form={this.props.form}
                                // @ts-ignore
                                onFormChange={this.props.onFormChange}
                            />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    }

}