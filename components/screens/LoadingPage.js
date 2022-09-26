/* eslint-disable prettier/prettier */
import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import GlobalStyle from '../helper/GlobalStyle';
import {useDispatch} from 'react-redux';
import getData from '../helper/getData';

const LoadingPage = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    getData(dispatch);

    setTimeout(() => {
      navigation.replace('My Tasks');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('./../../assets/checklist.png')}
      />
      <Text style={[GlobalStyle.CustomFontBig, styles.text]}>
        Your To-Do List
      </Text>
    </View>
  );
};

export default LoadingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0080ff',
  },

  image: {
    width: 150,
    height: 150,
    margin: 20,
  },

  text: {
    fontSize: 30,
    color: 'white',
  },
});
