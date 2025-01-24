import ChocoConfig from '../ChocoConfig';

import Input from './Input/Input';

import * as InputFunctions from './Input/InputFunctions';
// @ts-ignore
import React, {useState} from "react";
import ChocoForm from "./models/ChocoForm";

// @ts-ignore
import {ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View, KeyboardAvoidingView, Platform} from "react-native";

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
    let generalError = <View></View>;

    if (lang)
        ChocoConfig.lang = lang;

    if (form.generalError && form.generalError.show) {
        generalError = (<View style={{
            fontSize: 18,
            color: "red",
            marginBottom: 15,
            textAlign: "center"
        }}>{form.generalError.text}</View>)
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
        <View className={containerClassName + ' row'}>
            {formComponent}
            {generalError}
        </View>
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
export const FormModalTS: React.FC<FormModalTSProps> = (props) => {
    const {
        isOpen,
        toggle,
        title,
        form,
        onFormChange,
        cancelText,
        confirmText,
        confirmFunction,
    } = props;

    const [loading, setLoading] = useState<boolean>(false);

    const disabledStyle = !form.isValidForm ? { opacity: 0.5 } : {};

    const handleConfirm = async () => {
        if (form.isValidForm) {
            setLoading(true);
            await confirmFunction();
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <Modal
                isVisible={isOpen}
                backdropColor={'black'}
                backdropOpacity={0.7}
                useNativeDriver={true}
                animationIn={'zoomIn'}
                animationInTiming={200}
                onBackdropPress={toggle}
                onBackButtonPress={toggle}
                style={{ margin: 0, justifyContent: 'center' }}
            >
                <TouchableWithoutFeedback onPress={() => {/* prevent close on inner taps */}}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 20,
                        maxWidth: 500,
                        alignSelf: 'center',
                        width: '90%'
                    }}>
                        {title ? (
                            <Text style={{
                                fontSize: 30,
                                fontWeight: '600',
                                textAlign: 'center',
                                marginBottom: 20
                            }}>
                                {title}
                            </Text>
                        ) : null}

                        <ScrollView
                            keyboardShouldPersistTaps='always'
                            showsVerticalScrollIndicator={false}
                            style={{ maxHeight: '70%', marginBottom: 20 }}
                        >
                            <ChocoFormTS
                                form={form}
                                onFormChange={onFormChange}
                            />

                            {loading && (
                                <ActivityIndicator
                                    size={52}
                                    color={'black'}
                                    style={{ marginVertical: 20, alignSelf: 'center' }}
                                />
                            )}
                        </ScrollView>

                        {!loading && (
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                                <TouchableOpacity
                                    onPress={toggle}
                                    style={{ paddingVertical: 12, paddingHorizontal: 16 }}
                                >
                                    <Text style={{ fontSize: 18, color: 'black' }}>
                                        {cancelText}
                                    </Text>
                                </TouchableOpacity>

                                <View style={{ width: 12 }} />

                                <TouchableOpacity
                                    onPress={handleConfirm}
                                    style={{
                                        paddingVertical: 12,
                                        paddingHorizontal: 16,
                                        borderRadius: 6,
                                        backgroundColor: form.isValidForm ? ChocoConfig.mainColor : '#ccc',
                                        ...disabledStyle
                                    }}
                                    disabled={!form.isValidForm}
                                >
                                    <Text style={{ fontSize: 18, color: 'white', fontWeight: '500' }}>
                                        {confirmText}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </KeyboardAvoidingView>
    );
};