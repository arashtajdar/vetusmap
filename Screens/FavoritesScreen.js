import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import * as constants from '../Helpers/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesScreen = ({}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        const response = await axios.request(config);
        console.log(response.data.data);
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData().then(() => {});
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.location.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={data} renderItem={renderItem} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default FavoritesScreen;
