import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();
enableScreens();

import MapScreen from './Screens/MapScreen';
import LocationScreen from './Screens/LocationScreen';
import SettingsScreen from './Screens/SettingsScreen';
import ProfileScreen from './Screens/ProfileScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FavoritesScreen from './Screens/FavoritesScreen';

const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'MapStack'}
        component={MapScreen}
        options={({}) => ({
          headerShown: false,
        })}
      />
      <Stack.Screen name={'Location'} component={LocationScreen} />
    </Stack.Navigator>
  );
}
function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'SettingsStack'}
        component={SettingsScreen}
        options={({}) => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'ProfileStack'}
        component={ProfileScreen}
        options={({}) => ({
          headerShown: false,
        })}
      />
        <Stack.Screen name={'Favorites'} component={FavoritesScreen} />
    </Stack.Navigator>
  );
}

function App(): React.ReactElement {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={'Home'}
        screenOptions={{
          tabBarActiveTintColor: '#e91e63',
          headerShown: false,
        }}>
        <Tab.Screen
          name={'Settings'}
          component={SettingsStack}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name={'gamepad-circle-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name={'Home'}
          component={HomeStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name={'home-map-marker'}
                color={color}
                size={size}
              />
            ),
          }}
        />

        <Tab.Screen
          name={'Profile'}
          component={ProfileStack}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name={'account'}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
