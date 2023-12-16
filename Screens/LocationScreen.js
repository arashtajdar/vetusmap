import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {styles} from '../Helpers/AppStyles';
import nasoniImage from '../assets/images/nasoni.jpg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import * as constants from '../Helpers/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import Geolocation from "@react-native-community/geolocation";
import PropTypes from "prop-types";
import {endpointReviews} from "../Helpers/Constants";

let selectedLocation = [];
// selectedLocation.propTypes = {
//   name: PropTypes.string,
//   favorites: PropTypes.array,
// };
export default class LocationScreen extends React.Component {
  constructor(props) {
    super(props);
    selectedLocation = this.props.route.params.selectedLocation;
console.log(selectedLocation.id);
console.log(selectedLocation);
    this.state = {
      thisLocation: null,
      isInFavouriteList: !!selectedLocation.favorites.length ,
      userWroteReview: false ,
      loggedIn: false,
    };
  }
  componentDidMount = () => {
    this.checkLogin();
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
  WriteReview = async () => {
    const token = await AsyncStorage.getItem('token');

    let data = JSON.stringify({
      "location_id": this.state.thisLocation.id,
      "rating": 4,
      "comment": "A wonderful experience"
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: constants.apiBaseUrl + constants.endpointReviews,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data: data
    };

    axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });

  }

  ToggleFavourite = () => {
    this.setState({
      isInFavouriteList: !this.state.isInFavouriteList,
    });
    if(!this.state.isInFavouriteList){
      this.AddToFavorites().then(r => {
        Toast.show({
          type: 'info',
          text1: constants.favouritesAdded,
          position: 'bottom',
          bottomOffset : 22
        });
      });
    }else{
      this.RemoveFromFavorites().then(r => {
        Toast.show({
          type: 'info',
          text1: constants.favouritesRemoved,
          position: 'bottom',
          bottomOffset : 22
        });
      });
    }
  }
  AddToFavorites = async () => {
    const token = await AsyncStorage.getItem('token');
    let data = JSON.stringify({
      "location_id": this.state.thisLocation.id
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: constants.apiBaseUrl + constants.endpointAddToFavorites,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data : data
    };

    axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
  };
  RemoveFromFavorites= async () => {
    const token = await AsyncStorage.getItem('token');
    let data = JSON.stringify({
      "location_id": this.state.thisLocation.id
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: constants.apiBaseUrl + constants.endpointRemoveFromFavorites,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data : data
    };

    axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
  };

  render() {
    if (this.state.thisLocation != null) {
      return (
          <View>
            <View style={styles.locationMainView}>
              <Text>{this.state.thisLocation.name}</Text>
              <Image style={styles.locationScreenImage} source={nasoniImage} />
            </View>
            <View>

            </View>
            {this.state.loggedIn ?
                <TouchableOpacity
                    style={styles.locationFavouriteView}
                    onPress={this.ToggleFavourite}
                >
                  <MaterialCommunityIcons
                      name={'star'}
                      style={[styles.locationFavouriteStarButton,
                        this.state.isInFavouriteList ? styles.locationFavouriteStarButtonActive : null]}
                  />
                </TouchableOpacity> : null
            }
            {!this.state.userWroteReview ?
                <TouchableOpacity
                    style={styles.locationReviewView}
                    onPress={this.WriteReview}
                >
                  <MaterialCommunityIcons
                      name={'pencil-circle-outline'}
                      style={styles.locationReviewButton}
                  />
                </TouchableOpacity> : null
            }

            <Toast/>
          </View>

      );
    }
  }
}
