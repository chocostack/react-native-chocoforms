import React, { useState } from 'react';

import { Modal, View, TouchableWithoutFeedback, Text } from 'react-native';

import Radio from './Radio';

const OptionModal = (props) => {

    const selectItem = (item) => {
        props.callback(item);

        props.toggleModal();
    }

    return (
        <Modal
            transparent={true}
            visible={props.isVisible}
            onRequestClose={props.toggleModal}>
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
                    <Text style={{ fontSize: 20, padding: 7, fontWeight: 'bold', ...props.titleStyles }}>
                        {props.title}
                    </Text>
                    {props.options.map(item => <TouchableWithoutFeedback key={item.id} onPress={() => selectItem(item)}>
                        <View style={{ padding: 15, flexDirection: 'row' }}>
                            <Radio
                                selected={props.selected == item.id}
                                style={props.radioStyle}
                                selectedColor={props.selectedColor}
                            />
                            <View style={{ marginLeft: 15, paddingRight: 25 }}>
                                <Text style={{ fontSize: 17, ...props.textStyles }}>
                                    {item.text}
                                </Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>)}

                </View>
            </View>
        </Modal>
    );
};

export default OptionModal;