import React, {Component} from 'react';
import {
  View,
  Modal,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {styles} from '../Helpers/AppStyles';
import * as constants from '../Helpers/Constants';

export default class FilterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedItem: null,
      renderData: props.renderData,
    };
  }
  onPressHandler(id) {
    for (let data of this.state.renderData) {
      if (data.id === id) {
        data.selected = data.selected == null ? true : !data.selected;
        break;
      }
    }
    this.props.updateRenderData(this.state.renderData); // Update renderData in the parent component
  }
  setModalVisible = flag => {
    this.setState({modalVisible: flag});
  };
  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <View style={styles.modalMainContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Select/deselect categories</Text>
              <FlatList
                // horizontal={true}
                numColumns={4}
                data={this.state.renderData}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => this.onPressHandler(item.id)}>
                    <Text
                      style={[
                        item.selected === true
                          ? styles.filterCategoryNameSelected
                          : styles.filterCategoryNameNotSelected,
                        styles.filterCategoryName,
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <View>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() =>
                    this.setModalVisible(!this.state.modalVisible)
                  }>
                  <Text style={styles.textStyle}>
                    {constants.hideFilterText}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        {!this.state.modalVisible ? (
          <View style={styles.centeredView}>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => this.setModalVisible(true)}>
              <Text style={styles.textStyle}>{constants.showFilterText}</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    );
  }
}
