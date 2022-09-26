/* eslint-disable prettier/prettier */
import {configureStore} from '@reduxjs/toolkit';
import ToDoSlice from './ToDoSlice';

const store = configureStore({
  reducer: ToDoSlice,
});

export default store;
