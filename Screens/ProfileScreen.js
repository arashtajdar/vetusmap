import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {styles} from '../Helpers/AppStyles';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      currentUser: null,
    };
    GoogleSignin.configure({
      androidClientId: Config.OAUTH_KEY,
      iosClientId: 'ADD_YOUR_iOS_CLIENT_ID_HERE',
    });
  }

  async componentDidMount() {
    this.checkUserSignIn();
  }

  checkUserSignIn = async () => {
    // Check if the user is already logged in and update the state accordingly
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      const user = await AsyncStorage.getItem('user'); // Retrieve user data from storage
      this.setState({ isLoggedIn: true, currentUser: JSON.parse(user) });
    } else {
      this.setState({ isLoggedIn: false });
    }
  };

  handleSignIn = () => {
    GoogleSignin.hasPlayServices()
        .then(async hasPlayService => {
          if (hasPlayService) {
            GoogleSignin.signIn()
                .then(async userInfo => {
                  // Update the state with user data before storing it in AsyncStorage
                  this.setState({ isLoggedIn: true, currentUser: userInfo });

                  // Store user data in AsyncStorage for persistence
                  await AsyncStorage.setItem('user', JSON.stringify(userInfo));
                })
                .catch(error => {
                  console.log('Error during sign-in: ', error);
                });
          }
        })
        .catch(error => {
          console.log('Error during sign-in: ', error);
        });
  };

  handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      console.log('Signed out');
    } catch (error) {
      console.error('Error during sign-out: ', error);
    }

    // Remove user data from AsyncStorage when signing out
    await AsyncStorage.removeItem('user');

    this.setState({
      isLoggedIn: false,
      currentUser: null,
    });
  };

  render() {
    return (
        <View style={styles.ProfileContainer}>
          <Text style={styles.title}>Profile</Text>

          {this.state.isLoggedIn ? (
              <View>
                {this.state.currentUser && this.state.currentUser.user && (
                    <View style={styles.userInfo}>
                      <Image
                          source={{ uri: this.state.currentUser.user.photo }}
                          style={styles.userImage}
                      />
                      <Text>{this.state.currentUser.user.name}</Text>
                      <Text>{this.state.currentUser.user.email}</Text>
                    </View>
                )}
                <Button title="Sign out" onPress={this.handleSignOut} />
              </View>
          ) : (
              <Button title="Sign in with Google" onPress={this.handleSignIn} />
          )}
        </View>
    );
  }
}

export default ProfileScreen;
