import React, {Component} from 'react';
import {View, Text, Button, Image, Pressable} from 'react-native';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Env from '../Helpers/EnvConstants';
import {styles} from '../Helpers/AppStyles';
import axios from 'axios';
import * as constants from '../Helpers/Constants';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      currentUser: null,
    };
    GoogleSignin.configure({
      androidClientId: Env.googleSignInClientIdAndroid,
      iosClientId: Env.googleSignInClientIdIos,
    });
  }

  async componentDidMount() {
    await this.checkUserSignIn();
  }

  checkUserSignIn = async () => {
    // Check if the user is already logged in and update the state accordingly
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      const user = await AsyncStorage.getItem('user'); // Retrieve user data from storage
      this.setState({isLoggedIn: true, currentUser: JSON.parse(user)});
    } else {
      this.setState({isLoggedIn: false});
    }
  };

  handleSignIn = () => {
    GoogleSignin.hasPlayServices()
      .then(async hasPlayService => {
        if (hasPlayService) {
          GoogleSignin.signIn()
            .then(async userInfo => {
              //
              GoogleSignin.getTokens().then(async res=>{
                await AsyncStorage.setItem('user', JSON.stringify(userInfo));
                await AsyncStorage.setItem('accessToken', res.accessToken);
                let data = JSON.stringify({
                  "provider": "google",
                  "access_provider_token": res.accessToken
                });

                let config = {
                  method: 'post',
                  maxBodyLength: Infinity,
                  url: constants.apiBaseUrl + constants.endpointGoogleLoginCallback,
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  data : data
                };
                axios.request(config)
                    .then(async (response) => {
                      await AsyncStorage.setItem('token', response.data.token);
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                // Update the state with user data before storing it in AsyncStorage
                this.setState({isLoggedIn: true, currentUser: userInfo});
              });
            })
            .catch(error => {
              console.log('Error during sign-in: ', error);
            });
        }
      })
      .catch(error => {
        console.log('Play service error: ', error);
      });
  };

  handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error during sign-out: ', error);
    }
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
                  source={{uri: this.state.currentUser.user.photo}}
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
        <View style={styles.favoritesButtonView}>
          <Button title="Favorites"
                  onPress={() => {this.props.navigation.navigate('Favorites')}}
                  color="#f194ff"
          />
        </View>

      </View>
    );
  }
}

export default ProfileScreen;
