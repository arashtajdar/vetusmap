import React, { Component } from 'react';
import {View, Modal, Text, Alert, Pressable} from 'react-native';
import {styles} from '../Helpers/AppStyles';
import * as constants from '../Helpers/Constants';



export default class FilterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
        };
    }
    setModalVisible = (flag) => {
        this.setState({modalVisible: flag});
    }
    render() {
        return (
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Hello World!</Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                                <Text style={styles.textStyle}>Hide Modal</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                {!this.state.modalVisible ?
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => this.setModalVisible(true)}>
                        <Text style={styles.textStyle}>{constants.showFilterText}</Text>
                    </Pressable> : null
                }
            </View>
        );
    }
}
