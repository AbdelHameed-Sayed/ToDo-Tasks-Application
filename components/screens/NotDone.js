/* eslint-disable prettier/prettier */

import React from 'react';

import ToDos from '../helper/ToDos';

const NotDone = ({navigation}) => {
  return <ToDos doneState="notDone" navigation={navigation} />;
};

export default NotDone;
