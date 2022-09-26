import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoadingPage from './components/screens/LoadingPage';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NotDone from './components/screens/NotDone';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Done from './components/screens/Done';
import NewTask from './components/screens/NewTask';
import Camera from './components/screens/Camera';

const Tab = createBottomTabNavigator();
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, size, color}) => {
          let iconName;
          if (route.name === 'Not Done') {
            iconName = 'clipboard-list';
            size = focused ? 25 : 20;
          } else if (route.name === 'Done') {
            iconName = 'key';
            size = focused ? 25 : 20;
          }
          return <FontAwesome5Icon name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: '#0080ff',
        tabBarInactiveTintColor: '#777777',
        tabBarLabelStyle: {fontSize: 15, fontWeight: 'bold'},
      })}>
      <Tab.Screen
        name={'Not Done'}
        component={NotDone}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={'Done'}
        component={Done}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoadingPage"
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#0080ff',
          },
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: 'bold',
          },
          headerTintColor: 'white',
        }}>
        <Stack.Screen
          name="LoadingPage"
          component={LoadingPage}
          options={{headerShown: false}}
        />
        <Stack.Screen name="My Tasks" component={HomeTabs} />

        <Stack.Screen name="Task" component={NewTask} />

        <Stack.Screen name="Camera" component={Camera} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
