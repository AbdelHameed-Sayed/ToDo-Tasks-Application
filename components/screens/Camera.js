/* eslint-disable prettier/prettier */
import {Image, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import Button from '../helper/Button';

const Camera = ({navigation}) => {
  const [imageSRC, setImageSRC] = useState('');

  const cameraHandler = () => {
    const options = {
      cameraType: 'back',
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: true,
    };

    launchCamera(options, e => {
      if (e.didCancel) {
        console.log('cancelled');
      } else if (e.errorMessage) {
        console.log('error: ' + e.errorMessage);
      } else if (e.errorCode) {
        console.log(e.errorCode);
      } else {
        const source = {
          uri: 'data:image/jpeg;base64,' + e.assets[0].base64,
        };
        setImageSRC(source);
        navigation.navigate({
          name: 'Task',
          params: {image: source},
          merge: true,
        });
      }
    });
  };

  const galleryHandler = () => {
    launchImageLibrary(
      {
        includeBase64: true,
      },
      e => {
        if (e.didCancel) {
          console.log('cancelled');
        } else if (e.errorMessage) {
          console.log('error: ' + e.errorMessage);
        } else if (e.errorCode) {
          console.log(e.errorCode);
        } else {
          const source = {
            uri: 'data:image/jpeg;base64,' + e.assets[0].base64,
          };
          setImageSRC(source);
          navigation.navigate({
            name: 'Task',
            params: {image: source},
            merge: true,
          });
        }
      },
    );
  };

  return (
    <View style={styles.body}>
      <View style={styles.BTNContainer}>
        <Button
          color="green"
          title="Camera"
          onPress={() => {
            cameraHandler();
          }}
        />

        <Button
          color="green"
          title="Gallery"
          onPress={() => {
            galleryHandler();
          }}
        />
      </View>
      <Image source={imageSRC} style={styles.image} />
    </View>
  );
};

export default Camera;

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
  },

  BTNContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 65,
  },

  image: {
    width: '95%',
    height: '80%',
    borderWidth: 2,
    borderColor: '#555555',
  },
});
