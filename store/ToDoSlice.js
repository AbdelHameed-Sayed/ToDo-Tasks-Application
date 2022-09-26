/* eslint-disable prettier/prettier */
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: 'ToDos',
  initialState,

  reducers: {
    taskHandler: (state, action) => {
      state.tasks = action.payload;
    },
  },
});

export const {taskHandler} = taskSlice.actions;

export default taskSlice.reducer;
