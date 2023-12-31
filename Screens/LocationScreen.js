import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from '../Helpers/AppStyles';
import nasoniImage from '../assets/images/nasoni.jpg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import * as constants from '../Helpers/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

let selectedLocation = [];
// selectedLocation.propTypes = {
//   name: PropTypes.string,
//   favorites: PropTypes.array,
// }; todo
export default class LocationScreen extends React.Component {
  constructor(props) {
    super(props);
    selectedLocation = this.props.route.params.selectedLocation;
    this.state = {
      thisLocation: null,
      isInFavouriteList: !!selectedLocation.favorites.length,
      userWroteReview: !!selectedLocation.reviews.length,
      userReviewContent: selectedLocation.reviews[0],
      loggedIn: false,
      reviewsList: [],
      modalVisible: false,
      commentValue: '',
      selectedRating: 5,
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

  checkLogin = async () => {
    const value = await AsyncStorage.getItem('accessToken');
    await this.getAllReviews(value);
    await this.getAllUserFavs();
    if (value) {
      this.setState({
        loggedIn: true,
      });
    } else {
      this.setState({
        loggedIn: false,
      });
    }
  };
  WriteReview = async (rating, comment) => {
    const token = await AsyncStorage.getItem('token');
    const googleToken = await AsyncStorage.getItem('accessToken');

    let data = JSON.stringify({
      location_id: this.state.thisLocation.id,
      rating: rating,
      comment: comment,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: constants.apiBaseUrl + constants.endpointReviews,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: data,
    };

    axios
      .request(config)
      .then(() => {
        this.RemoveFromFavorites().then(() => {
          Toast.show({
            type: 'info',
            text1: constants.reviewAdded,
            position: 'bottom',
            bottomOffset: 22,
          });
        });
        this.getAllReviews(googleToken);
      })
      .catch(error => {
        console.log(error);
      });
  };

  ToggleFavourite = () => {
    this.setState({
      isInFavouriteList: !this.state.isInFavouriteList,
    });
    if (!this.state.isInFavouriteList) {
      this.AddToFavorites().then(() => {
        Toast.show({
          type: 'info',
          text1: constants.favouritesAdded,
          position: 'bottom',
          bottomOffset: 22,
        });
      });
    } else {
      this.RemoveFromFavorites().then(() => {
        Toast.show({
          type: 'info',
          text1: constants.favouritesRemoved,
          position: 'bottom',
          bottomOffset: 22,
        });
      });
    }
  };
  AddToFavorites = async () => {
    const token = await AsyncStorage.getItem('token');
    let data = JSON.stringify({
      location_id: this.state.thisLocation.id,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: constants.apiBaseUrl + constants.endpointAddToFavorites,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  };
  RemoveFromFavorites = async () => {
    const token = await AsyncStorage.getItem('token');
    let data = JSON.stringify({
      location_id: this.state.thisLocation.id,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: constants.apiBaseUrl + constants.endpointRemoveFromFavorites,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  };
  getAllReviews = async specificGoogleToken => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url:
        constants.apiBaseUrl +
        constants.endpointReviews +
        '?location_id=' +
        this.state.thisLocation.id,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    };

    await axios
      .request(config)
      .then(response => {
        const filteredArray = response.data.data.filter(
          item => item.user && item.user.google_token === specificGoogleToken,
        );
        console.log(!!filteredArray.length);
        console.log(filteredArray[0]);
        console.log(response.data.data);
        console.log(specificGoogleToken);
        this.setState({
          reviewsList: response.data.data,
          userWroteReview: !!filteredArray.length,
          userReviewContent: filteredArray[0],
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  getAllUserFavs = async () => {
    const token = await AsyncStorage.getItem('token');
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: constants.apiBaseUrl + constants.endpointFetchAllUsersFavorites,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };

    await axios
      .request(config)
      .then(response => {
        const filteredArray = response.data.data.filter(
          item =>
            item.location && item.location.id === this.state.thisLocation.id,
        );
        this.setState({
          isInFavouriteList: !!filteredArray.length,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  setModalVisible = flag => {
    this.setState({
      modalVisible: flag,
    });
  };
  rate = rating => {
    this.setState({selectedRating: rating});
  };
  render() {
    const ratesArray = [1, 2, 3, 4, 5];

    if (this.state.thisLocation != null) {
      return (
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Write a review</Text>
                <TextInput
                  editable
                  multiline
                  numberOfLines={6}
                  maxLength={100}
                  style={styles.modalTextInput}
                  onChangeText={val => {
                    this.setState({
                      commentValue: val,
                    });
                  }}
                />
                <View style={styles.ReviewRatingContainer}>
                  {ratesArray.map(n => {
                    return (
                      <Pressable
                        key={n}
                        style={[styles.ReviewRatingButtonDefault]}
                        color={
                          this.state.selectedRating &&
                          n > this.state.selectedRating
                            ? '#ababab'
                            : '#ffcd00'
                        }
                        onPress={() => this.rate(n)}>
                        <MaterialCommunityIcons
                          name={'star'}
                          style={[
                            styles.locationFavouritePlusButton,
                            this.state.selectedRating &&
                            n > this.state.selectedRating
                              ? null
                              : styles.locationFavouritePlusButtonActive,
                          ]}
                        />
                      </Pressable>
                    );
                  })}
                </View>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    this.WriteReview(
                      this.state.selectedRating,
                      this.state.commentValue,
                    ).then(() => this.setModalVisible(false));
                  }}>
                  <Text style={styles.textStyle}>Submit</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <View style={styles.locationMainView}>
            <Image style={styles.locationScreenImage} source={nasoniImage} />
            <Text>{this.state.thisLocation.description}</Text>
            <ScrollView style={styles.reviewList}>
              {this.state.userWroteReview ? (
                <View
                  style={[styles.reviewListItem, styles.reviewListUserReview]}>
                  <Text style={styles.reviewListItemName}>
                    Your Review [
                    <Text style={styles.reviewListItemScore}>
                      {this.state.userReviewContent.rating}
                    </Text>
                    ]
                  </Text>
                  <Text style={styles.reviewListItemComment}>
                    {this.state.userReviewContent.comment}
                  </Text>
                </View>
              ) : null}
              {this.state.reviewsList.map(review => {
                return (
                  <View key={review.review_id} style={styles.reviewListItem}>
                    <Text style={styles.reviewListItemName}>
                      {review.user.name} [
                      <Text style={styles.reviewListItemScore}>
                        {review.rating}
                      </Text>
                      ]
                    </Text>
                    <Text style={styles.reviewListItemComment}>
                      {review.comment}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          {this.state.loggedIn ? (
            <TouchableOpacity
              style={styles.locationFavouriteView}
              onPress={this.ToggleFavourite}>
              <MaterialCommunityIcons
                name={'book-plus'}
                style={[
                  styles.locationFavouritePlusButton,
                  this.state.isInFavouriteList
                    ? styles.locationFavouritePlusButtonActive
                    : null,
                ]}
              />
            </TouchableOpacity>
          ) : null}
          {!this.state.userWroteReview ? (
            <TouchableOpacity
              style={styles.locationReviewView}
              onPress={() => this.setModalVisible(true)}>
              <MaterialCommunityIcons
                name={'comment-plus-outline'}
                style={styles.locationReviewButton}
              />
            </TouchableOpacity>
          ) : null}

          <Toast />
        </View>
      );
    }
  }
}
