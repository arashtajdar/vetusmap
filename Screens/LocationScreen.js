import React from 'react';
import {View, Text} from 'react-native';

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
        <View>
          <Text>{this.state.thisLocation.name}</Text>
        </View>
      );
    }
  }
}
