import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Home from '../Home/Home';
import Friends from '../Friends/Friends';
import Settings from '../Settings/Settings';
import * as Constants from '../../Constants/Constants';
import Icon from 'react-native-vector-icons/FontAwesome';

export default createBottomTabNavigator(
  {
    Home: { 
      screen: Home,
      navigationOptions: {
        tabBarIcon: () => {
            return <Icon name="home" size={25} color='green' />;
        },
      },
    },
    Friends: { 
      screen: Friends,
      navigationOptions: {
        tabBarIcon: () => {
            return <Icon name="users" size={25} color='green' />;
        },
      },
     },
    Settings: { 
      screen: Settings,
      navigationOptions: {
        tabBarIcon: () => {
            return <Icon name="cog" size={25} color='green' />;
        },
      },
    },
  }, 
  {
    tabBarOptions: {
      activeTintColor: 'green',
      activeBackgroundColor: Constants.primaryHeaderColor,
      inactiveBackgroundColor: Constants.primaryHeaderColor,
    }
  }
);
