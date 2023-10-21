import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import {styles} from '../Helpers/AppStyles';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: false,
    };
  }

  toggleTheme = () => {
    this.setState((prevState) => ({
      darkMode: !prevState.darkMode,
    }));
  };

  navigateTo = (page) => {
    // You can navigate to different pages based on 'page' parameter here.
    // Implement your navigation logic.
    // For now, let's just print the page name to the console.
    console.log(`Navigating to ${page} page.`);
  };

  render() {
    return (
        <View style={styles.SettingsContainer}>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.SettingsOption}>
            <Text>Dark Mode</Text>
            <Switch
                value={this.state.darkMode}
                onValueChange={this.toggleTheme}
            />
          </View>

          <TouchableOpacity
              style={styles.SettingsOption}
              onPress={() => this.navigateTo('QA')}
          >
            <Text>QA Page</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.SettingsOption}
              onPress={() => this.navigateTo('Support')}
          >
            <Text>Support Page</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.SettingsOption}
              onPress={() => this.navigateTo('Website')}
          >
            <Text>Website</Text>
          </TouchableOpacity>

          {/* Add more settings options here as needed. */}
        </View>
    );
  }
}


export default SettingsScreen;
