import React from 'react';
import {View, Text, Image} from 'react-native';
import {styles} from '../Helpers/AppStyles';
import nasoniImage from '../assets/images/nasoni.jpg';

export default class LocationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thisLocation: null,
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

  render() {
    if (this.state.thisLocation != null) {
      return (
        <View style={styles.locationMainView}>
          <Text>{this.state.thisLocation.name}</Text>
          <Image style={styles.locationScreenImage} source={nasoniImage} />
        </View>
      );
    }
  }
}
