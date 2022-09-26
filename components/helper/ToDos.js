/* eslint-disable prettier/prettier */
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import GlobalStyle from '../helper/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getData from '../helper/getData';
import CheckBox from '@react-native-community/checkbox';

const ToDos = ({navigation, doneState}) => {
  const dispatch = useDispatch();
  const toDos = useSelector(state => state.tasks);

  const notDoneToDos = toDos.filter(toDo => !toDo.isDone);
  const doneToDos = toDos.filter(toDo => toDo.isDone);

  const deleteHandler = async item => {
    try {
      const excludeTask = toDos.filter(todo => todo.id !== item.id);

      const jsonValue = JSON.stringify(excludeTask);

      await AsyncStorage.setItem('ToDo', jsonValue);

      ToastAndroid.show('Task deleted successfully', ToastAndroid.SHORT);

      getData(dispatch);
    } catch (error) {
      console.log(error);
    }
  };

  const checkBoxModifyHandler = async (item, isDone) => {
    try {
      const jsonValue = JSON.stringify(
        toDos.map(todo => {
          if (todo.id === item.id) {
            todo.isDone = isDone;
          }
          return todo;
        }),
      );

      await AsyncStorage.setItem('ToDo', jsonValue);
      getData(dispatch);
    } catch (error) {
      console.log(error);
    }
  };
  const renderItem = ({item, index}) => (
    <Pressable
      onPress={() => {
        navigation.replace('Task', {item, Modify: true});
      }}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            deleteHandler(item);
          }}>
          <FontAwesome5Icon name="trash" size={30} color="red" />
        </TouchableOpacity>

        <View style={styles.taskCheckContainer}>
          <CheckBox
            value={item.isDone}
            onValueChange={newValue => checkBoxModifyHandler(item, newValue)}
          />

          <View>
            <Text style={[GlobalStyle.CustomFontHW, styles.title]}>
              {item.title}
            </Text>
            <Text style={[GlobalStyle.CustomFontHW, styles.description]}>
              {item.description}
            </Text>
          </View>
        </View>

        <View style={[{backgroundColor: item.color}, styles.color]} />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.body}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          navigation.replace('Task');
        }}>
        <FontAwesome5Icon name={'plus'} size={20} color={'white'} />
      </TouchableOpacity>

      {toDos.length === 0 ? (
        <Text style={[GlobalStyle.CustomFontHW, styles.emptyTasks]}>
          Start Writing down your tasks
        </Text>
      ) : (
        <FlatList
          data={doneState === 'done' ? doneToDos : notDoneToDos}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default ToDos;

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },

  btn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0080ff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
    elevation: 5,
    zIndex: 10,
  },

  container: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 7,
    marginHorizontal: 10,
    paddingLeft: 10,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: 'white',
  },

  title: {
    color: '#000000',
    fontSize: 30,
    margin: 5,
  },

  description: {
    color: '#999999',
    fontSize: 20,
    margin: 5,
  },

  emptyTasks: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 20,
    color: '#428bd9',
  },

  taskCheckContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  color: {
    width: 20,
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    elevation: 5,
  },
});
