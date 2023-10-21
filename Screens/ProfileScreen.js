import React from 'react';
import {Button, View} from 'react-native';
import {Text} from '@rneui/base';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

export default class ProfileScreen extends React.Component {
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
    // Check if the user is already logged in and update the state accordingly
    GoogleSignin.isSignedIn()
      .then(async isSignedIn => {
        if (isSignedIn) {
          const user = await AsyncStorage.getItem('user'); // Retrieve user data from storage
          this.setState({isLoggedIn: true, currentUser: JSON.parse(user)});
        }
        this.setState({isLoggedIn: isSignedIn});
      })
      .catch(error => {
        console.log('Error checking sign-in status: ', error);
      });
  }

  handleSignIn = () => {
    GoogleSignin.hasPlayServices()
      .then(hasPlayService => {
        if (hasPlayService) {
          GoogleSignin.signIn()
            .then(async userInfo => {
              console.log(JSON.stringify(userInfo));
              console.log(userInfo.user.email);

              // Update the state with user data before storing it in AsyncStorage
              this.setState({isLoggedIn: true, currentUser: userInfo});

              // Store user data in AsyncStorage for persistence
              await AsyncStorage.setItem('user', JSON.stringify(userInfo));
            })
            .catch(e => {
              console.log('ERROR IS: ' + JSON.stringify(e));
            });
        }
      })
      .catch(e => {
        console.log('ERROR IS: ' + JSON.stringify(e));
      });
  };

  handleSignOut = () => {
    try {
      GoogleSignin.signOut().then(() => {
        console.log('Signed out');
      });
    } catch (error) {
      console.error(error);
    }

    // Remove user data from AsyncStorage when signing out
    AsyncStorage.removeItem('user');

    this.setState({
      isLoggedIn: false,
      currentUser: null,
    });
  };

  getCurrentUser = () => {
    const currentUser = GoogleSignin.getCurrentUser();
    this.setState({
      currentUser: currentUser,
    });
  };

  render() {
    return (
      <View>
        <Text>Profile view</Text>
        {this.state.isLoggedIn ? (
          <View>
            <Text>
              {this.state.currentUser && this.state.currentUser.user
                ? this.state.currentUser.user.email
                : ''}
            </Text>
            <Button title={'Sign out'} onPress={this.handleSignOut} />
          </View>
        ) : (
          <Button title={'Sign in with Google'} onPress={this.handleSignIn} />
        )}
      </View>
    );
  }
}
