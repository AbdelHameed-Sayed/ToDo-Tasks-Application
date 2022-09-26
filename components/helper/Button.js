/* eslint-disable prettier/prettier */
import {Pressable, StyleSheet, Text} from 'react-native';
import React from 'react';

const Button = props => {
  return (
    <Pressable
      onPress={props.onPress}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      android_ripple={{color: '#00000050'}}
      style={({pressed}) => [
        {backgroundColor: pressed ? '#dddddd' : props.color},
        styles.button,
        props.style,
      ]}>
      <Text style={styles.text}>{props.title}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
  },

  text: {
    color: '#ffffff',
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
});
