/* eslint-disable prettier/prettier */
import React from 'react';

import ToDos from '../helper/ToDos';

const Done = ({navigation}) => {
  return <ToDos doneState="done" navigation={navigation} />;
};

export default Done;
