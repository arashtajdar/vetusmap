/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {enableScreens} from 'react-native-screens';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const Stack = createNativeStackNavigator();
enableScreens();

import Map from './Screens/Map';
import Location from "./Screens/Location";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import SettingsScreen from "./Screens/SettingsScreen";
import ProfileScreen from "./Screens/ProfileScreen";
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Map"
                component={Map}
                options={({ navigation, route }) => ({
                    headerShown: false
                })}
            />
            <Stack.Screen
                name="Location"
                component={Location}
            />
        </Stack.Navigator>
    );
}

function App(): JSX.Element {
    return (
        <NavigationContainer>
            <Tab.Navigator      initialRouteName="Profile"
                                screenOptions={{
                                    tabBarActiveTintColor: '#e91e63',
                                    headerShown: false
                                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeStack}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen name="Settings" component={SettingsScreen}                     options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="gamepad-circle-outline" color={color} size={size} />
                    ),
                }}/>
                <Tab.Screen name="Profile" component={ProfileScreen}                     options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }}/>
            </Tab.Navigator>
        </NavigationContainer>
    );

}
// <NavigationContainer>
//     <Tab.Navigator>
//         <Tab.Screen name="Home" component={Map} />
//         <Tab.Screen name="Settings" component={SettingsScreen} />
//         <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//
// </NavigationContainer>
const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default App;
