import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
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
            return <Icon name="home" size={30} color={Constants.tertiaryBgColor} />;
        },
      },
    },
    Friends: { 
      screen: Friends,
      navigationOptions: {
        tabBarIcon: () => {
            return <Icon name="users" size={25} color={Constants.tertiaryBgColor} />;
        },
      },
     },
    Settings: { 
      screen: Settings,
      navigationOptions: {
        tabBarIcon: () => {
            return <Icon name="cog" size={30} color={Constants.tertiaryBgColor} />;
        },
      },
    },
  }, 
  {
    tabBarOptions: {
      inactiveTintColor: Constants.tertiaryBgColor,
      activeTintColor: 'white',
      activeBackgroundColor: Constants.primaryHeaderColor,
      inactiveBackgroundColor: Constants.primaryHeaderColor,
      style: {
        borderTopColor: Constants.tertiaryBgColor,
        borderTopWidth: 1,
        height: Dimensions.get('window').height * .075,
      },
      tabStyle: {
      }
    }
  }
);
