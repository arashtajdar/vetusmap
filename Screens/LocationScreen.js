import React from 'react';
import {View, Text, Image, Switch, TouchableOpacity} from 'react-native';
import {styles} from '../Helpers/AppStyles';
import nasoniImage from '../assets/images/nasoni.jpg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import * as constants from '../Helpers/Constants';

export default class LocationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thisLocation: null,
      favourite: false,
    };
  }
  componentDidMount = () => {
    let selectedLocation = this.props.route.params.selectedLocation;
    this.setState({
      thisLocation: selectedLocation,
    });
    this.props.navigation.setOptions({
      title: selectedLocation.name,
    });
  };
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
            <TouchableOpacity
                style={styles.locationFavouriteView}
                onPress={this.ToggleFavourite}
            >
              <MaterialCommunityIcons
                  name={'star'}
                  style={[styles.locationFavouriteStarButton,
                    this.state.favourite ? styles.locationFavouriteStarButtonActive : null]}
              />
            </TouchableOpacity>
            <Toast/>
          </View>

      );
    }
  }
}
