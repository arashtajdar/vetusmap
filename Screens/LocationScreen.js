import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {styles} from '../Helpers/AppStyles';
import nasoniImage from '../assets/images/nasoni.jpg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import * as constants from '../Helpers/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LocationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thisLocation: null,
      favourite: false,
      loggedIn: false,
    };
  }
  componentDidMount = () => {
    console.log(this.checkLogin());
    let selectedLocation = this.props.route.params.selectedLocation;
    this.setState({
      thisLocation: selectedLocation,
    });
    this.props.navigation.setOptions({
      title: selectedLocation.name,
    });
  };

  checkLogin = async () =>{
    const value = await AsyncStorage.getItem('accessToken');
    console.log(value);
    if(value){
      this.setState({
        loggedIn: true,
      });
    }else{
      this.setState({
        loggedIn: false,
      });
    }
  }
  ToggleFavourite = () => {
    this.setState({
      favourite: !this.state.favourite,
    });
    Toast.show({
      type: 'info',
      text1: this.state.favourite ? constants.favouritesRemoved : constants.favouritesAdded,
      position: 'bottom',
      bottomOffset : 22
    });
  }
  render() {
    if (this.state.thisLocation != null) {
      return (
          <View>
            <View style={styles.locationMainView}>
              <Text>{this.state.thisLocation.name}</Text>
              <Image style={styles.locationScreenImage} source={nasoniImage} />
            </View>
            {this.state.loggedIn ?
                <TouchableOpacity
                    style={styles.locationFavouriteView}
                    onPress={this.ToggleFavourite}
                >
                  <MaterialCommunityIcons
                      name={'star'}
                      style={[styles.locationFavouriteStarButton,
                        this.state.favourite ? styles.locationFavouriteStarButtonActive : null]}
                  />
                </TouchableOpacity> : null
            }
            <Toast/>
          </View>

      );
    }
  }
}
