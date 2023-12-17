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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class FilterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedItem: null,
      renderData: [],
    };
  }
  componentDidMount() {
    this.fetchCategories(); // Fetch categories when the component mounts
  }
  // Add a method to fetch categories from the API
  fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: constants.apiBaseUrl + constants.endpointCategories,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      };

      const response = await axios.request(config);
      const categories = response.data.data; // Assuming the API response contains an array of categories
      const renderData = categories.map(category => ({
        id: category.category_id,
        name: category.name,
        selected: false, // Initialize selected as false for each category
      }));
      this.setState({ renderData });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
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
