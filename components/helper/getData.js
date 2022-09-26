/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {taskHandler} from '../../store/ToDoSlice';

export default async function getData(dispatch) {
  try {
    const jsonValue = await AsyncStorage.getItem('ToDo');

    jsonValue != null ? dispatch(taskHandler(JSON.parse(jsonValue))) : null;
  } catch (error) {
    console.log(error);
  }
}
