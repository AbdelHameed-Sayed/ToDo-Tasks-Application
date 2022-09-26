/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  Alert,
  Image,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Button from '../helper/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import getData from '../helper/getData';
import CheckBox from '@react-native-community/checkbox';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import notifee, {TriggerType, TimestampTrigger} from '@notifee/react-native';

const NewTask = ({navigation, route}) => {
  const dispatch = useDispatch();

  const toDos = useSelector(state => state.tasks);

  const [title, setTitle] = useState(route?.params?.item?.title || '');

  const [description, setDescription] = useState(
    route?.params?.item?.description || '',
  );

  const [isDone, setIsDone] = useState(route?.params?.item?.isDone || false);

  const [color, setColor] = useState(route?.params?.item?.color || '');

  let image = route?.params?.image || route?.params?.item?.image || '';

  const [reminderModal, setReminderModal] = useState(false);
  const [fullScreenImageModal, setFullScreenImageModal] = useState(false);

  const date = new Date(Date.now());

  const [reminderDay, setReminderDay] = useState(date.getDate().toString());
  const [reminderMonth, setReminderMonth] = useState(
    (date.getMonth() + 1).toString(),
  );
  const [reminderHour, setReminderHour] = useState(date.getHours().toString());
  const [reminderMinutes, setReminderMinutes] = useState(
    (date.getMinutes() + 1).toString(),
  );

  const storeToDo = async deleteImage => {
    try {
      let jsonValue;

      // Modify Tasks:
      if (route?.params?.Modify) {
        jsonValue = JSON.stringify(
          toDos.map(todo => {
            if (todo.id === route?.params.item.id) {
              todo.title = title;
              todo.description = description;
              todo.isDone = isDone;
              todo.color = color;
              todo.image = deleteImage ? '' : image;
            }
            return todo;
          }),
        );

        // Add new Tasks:
      } else {
        const id = toDos.length + 1;
        jsonValue = JSON.stringify(
          toDos.length > 0
            ? [...toDos, {id, title, description, isDone, color, image}]
            : [{id, title, description, isDone, color, image}],
        );
      }
      await AsyncStorage.setItem('ToDo', jsonValue);
      getData(dispatch);
    } catch (error) {
      console.log(error);
    }
  };

  const saveHandler = deleteImage => {
    title
      ? storeToDo(deleteImage) &&
        getData(dispatch) &&
        navigation.replace('My Tasks')
      : Alert.alert(
          'Alert Message',
          'Title can not be empty',
          [{text: 'UnaderStand'}],
          {cancelable: true},
        );
  };

  async function onDisplayNotification() {
    if (
      reminderHour < 0 ||
      reminderHour > 24 ||
      reminderMinutes < 0 ||
      reminderMinutes > 60
    ) {
      Alert.alert(
        'Invalid Time set',
        'Hours must be between 0 and 24, and minutes between 0 and 60',
      );
      return;
    }

    if (
      reminderDay < 1 ||
      reminderDay > 31 ||
      reminderMonth < 1 ||
      reminderMonth > 12
    ) {
      Alert.alert(
        'Invalid Date set',
        'Day must be between 1 and 31, and Month between 1 and 12',
      );
      return;
    }

    if (
      reminderDay < date.getDate() ||
      reminderMonth < date.getMonth() + 1 ||
      reminderHour < date.getHours() ||
      reminderMinutes <= date.getMinutes()
    ) {
      Alert.alert('Invalid Date set', 'Date and time must be in the future');
      return;
    }
    setReminderModal(false);

    date.setDate(reminderDay);
    date.setMonth(reminderMonth - 1);
    date.setHours(reminderHour);
    date.setMinutes(reminderMinutes);
    date.setSeconds(0);

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

    await notifee.createChannelGroup({
      id: '123',
      name: 'Tasks Alert',
    });

    await notifee.createChannel({
      id: '333',
      name: 'ToDos',
      sound: 'default',
      badge: true,
      bypassDnd: true,
      description: 'ToDo Alert',
      vibration: true,

      groupId: '123',
    });

    await notifee.onBackgroundEvent(e => {
      return e;
    });
    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: `<p style="color: #c44269;">${title}</p>`,

        body: `<p style="color: #4caf50; font-size: 19px;">${description}</p>`,

        android: {
          channelId: '333',
          smallIcon: 'ic_launcher',

          color: '#5286e5',

          timestamp: Date.now(),
          showTimestamp: true,

          groupSummary: true,
          groupId: '123',

          pressAction: {launchActivity: 'Done', id: '111'},
        },
      },
      trigger,
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.body}>
        {/* Reminder modal */}
        <Modal
          visible={reminderModal}
          transparent
          animationType="slide"
          hardwareAccelerated
          onRequestClose={() => setReminderModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <View style={styles.modalBody}>
                <Text style={styles.reminderText}>Remind me at: </Text>
                <View style={styles.modalTextInputContainer}>
                  <TextInput
                    style={[styles.modalTextInput, {color: '#da7e0e'}]}
                    keyboardType="numeric"
                    value={reminderDay}
                    onChangeText={value => setReminderDay(value)}
                  />

                  <TextInput
                    style={[styles.modalTextInput, {color: '#da7e0e'}]}
                    keyboardType="numeric"
                    value={reminderMonth}
                    onChangeText={value => setReminderMonth(value)}
                  />

                  <TextInput
                    style={[styles.modalTextInput, {color: '#0e66da'}]}
                    keyboardType="numeric"
                    value={reminderHour}
                    onChangeText={value => setReminderHour(value)}
                  />

                  <TextInput
                    style={[styles.modalTextInput, {color: '#0e66da'}]}
                    keyboardType="numeric"
                    value={reminderMinutes}
                    onChangeText={value => setReminderMinutes(value)}
                  />
                </View>

                <View style={styles.modalTextContainer}>
                  <Text
                    style={[
                      styles.reminderText,
                      {marginHorizontal: 26, color: '#1a74dc'},
                    ]}>
                    Day
                  </Text>
                  <Text
                    style={[
                      styles.reminderText,
                      {marginHorizontal: 12, color: '#1a74dc'},
                    ]}>
                    Month
                  </Text>
                  <Text
                    style={[
                      styles.reminderText,
                      {marginHorizontal: 21, color: '#da7e0e'},
                    ]}>
                    Hour
                  </Text>
                  <Text
                    style={[
                      styles.reminderText,
                      {marginHorizontal: 10, color: '#da7e0e'},
                    ]}>
                    minutes
                  </Text>
                </View>
              </View>
              <View style={styles.reminderBtnContainer}>
                <TouchableOpacity
                  style={[styles.reminderBTN, styles.reminderBtnOk]}
                  onPress={() => {
                    onDisplayNotification();
                  }}>
                  <Text style={[styles.reminderText, {color: '#1eb900'}]}>
                    OK
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.reminderBTN}
                  onPress={() => {
                    setReminderModal(false);
                  }}>
                  <Text style={[styles.reminderText, {color: '#b98400'}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Full screen image modal */}
        <Modal
          visible={fullScreenImageModal}
          transparent
          animationType="slide"
          hardwareAccelerated
          onRequestClose={() => setFullScreenImageModal(false)}>
          <Image source={image} style={styles.image} />

          <TouchableOpacity
            style={styles.back}
            onPress={() => {
              setFullScreenImageModal(false);
            }}>
            <FontAwesome5Icon name="arrow-left" size={30} />
          </TouchableOpacity>
        </Modal>

        <TextInput
          style={styles.input}
          placeholder="Title"
          onChangeText={value => setTitle(value)}
          value={title}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          multiline
          onChangeText={value => setDescription(value)}
          value={description}
        />

        <View style={styles.colorContainer}>
          <TouchableOpacity
            style={styles.whiteColor}
            onPress={() => {
              setColor('#ffffff');
            }}>
            {color === '#ffffff' && (
              <FontAwesome5Icon name="check" size={25} color="#000000" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cemonColor}
            onPress={() => {
              setColor('#f28b82');
            }}>
            {color === '#f28b82' && (
              <FontAwesome5Icon name="check" size={25} color="#000000" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.violetColor}
            onPress={() => {
              setColor('#aecbfa');
            }}>
            {color === '#aecbfa' && (
              <FontAwesome5Icon name="check" size={25} color="#000000" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.lemonColor}
            onPress={() => {
              setColor('#ccff90');
            }}>
            {color === '#ccff90' && (
              <FontAwesome5Icon name="check" size={25} color="#000000" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bellCamBtnsContainer}>
          <TouchableOpacity
            style={styles.reminder}
            onPress={() => {
              setReminderModal(true);
            }}>
            <FontAwesome5Icon name="bell" size={25} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.reminder}
            onPress={() => {
              navigation.navigate('Camera');
            }}>
            <FontAwesome5Icon name="camera" size={25} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {image && (
          <Pressable
            style={styles.imageContainer}
            onPress={() => {
              setFullScreenImageModal(true);
            }}>
            <Image source={image} style={styles.image} />
            <TouchableOpacity
              style={styles.trash}
              onPress={() => {
                saveHandler(true);
              }}>
              <FontAwesome5Icon name="trash" size={30} color="red" />
            </TouchableOpacity>
          </Pressable>
        )}

        <View style={styles.checkbox}>
          <CheckBox
            value={isDone}
            onValueChange={newValue => setIsDone(newValue)}
          />
          <Text>Is Done?</Text>
        </View>

        <View style={styles.btnContainer}>
          <Button
            title={route?.params?.Modify ? 'Modify' : 'Save'}
            color="#1eb900"
            onPress={() => {
              saveHandler();
              Keyboard.dismiss();
            }}
          />

          <Button
            title="Cancel"
            color="#b9b900"
            onPress={() => {
              Keyboard.dismiss();
              navigation.replace('My Tasks');
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewTask;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 10,
    backgroundColor: 'white',
    textAlign: 'left',
    fontSize: 20,
    margin: 10,
    paddingHorizontal: 10,
  },

  bellCamBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
  },

  btnContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
  },

  reminder: {
    width: '45%',
    height: 40,
    backgroundColor: '#2a73dfff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },

  colorContainer: {
    width: '100%',
    height: 50,
    marginVertical: 15,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
  },

  whiteColor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  cemonColor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f28b82',
  },
  violetColor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aecbfa',
  },
  lemonColor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccff90',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    width: 300,
    height: 200,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff',
    elevation: 10,
  },

  modalBody: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalTextInputContainer: {
    flexDirection: 'row',
  },

  modalTextContainer: {
    flexDirection: 'row',
  },

  modalTextInput: {
    width: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#555555',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
    margin: 10,
  },

  reminderText: {
    fontWeight: 'bold',
  },

  reminderBtnContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
  },

  reminderBTN: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  reminderBtnOk: {
    borderLeftWidth: 1,
  },

  imageContainer: {
    marginTop: 20,
    width: '100%',
    height: '30%',
    borderWidth: 2,
    borderColor: '#555555',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  trash: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },

  back: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
});
