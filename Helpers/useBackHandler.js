// useBackHandler.js
import {useEffect} from 'react';
import {BackHandler} from 'react-native';

const useBackHandler = callback => {
  useEffect(() => {
    const backAction = () => {
      callback();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [callback]);
};

export default useBackHandler;
