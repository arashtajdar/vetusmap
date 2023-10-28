import React, { Component } from 'react';
import {View, Modal, Text, Alert, Pressable, TouchableOpacity, FlatList} from 'react-native';
import {styles} from '../Helpers/AppStyles';
import * as constants from '../Helpers/Constants';



export default class FilterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            selectedItem: null,
            renderData:props.renderData,
        };
    }
    onPressHandler(id) {
        for(let data of this.state.renderData){
            if(data.id===id){
                data.selected=(data.selected==null)?true:!data.selected;
                break;
            }
        }
        this.props.updateRenderData(this.state.renderData); // Update renderData in the parent component
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
                            <Text style={styles.modalText}>Select/deselect categories</Text>
                            <FlatList
                                //horizontal={true}
                                data={this.state.renderData}
                                keyExtractor={item => item.id.toString()}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => this.onPressHandler(item.id)}>
                                        <View
                                            style={
                                                item.selected==true
                                                    ? {
                                                        padding: 10,
                                                        borderRadius: 5,
                                                        backgroundColor: '#15e536',
                                                    }
                                                    : {
                                                        padding: 10,
                                                        borderRadius: 5,
                                                        backgroundColor: '#a1a1a1',
                                                    }
                                            }>
                                            <Text>{item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                                <Text style={styles.textStyle}>{constants.hideFilterText}</Text>
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
