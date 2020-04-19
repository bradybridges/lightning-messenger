import React from 'react';
import { Dimensions } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Home from '../Home/Home';
import Friends from '../Friends/Friends';
import Settings from '../Settings/Settings';
import * as Constants from '../../Constants/Constants';

export default createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: () => <Icon name="home" size={30} color={Constants.tertiaryBgColor} />,
      },
    },
    Friends: {
      screen: Friends,
      navigationOptions: {
        tabBarIcon: () => <Icon name="users" size={25} color={Constants.tertiaryBgColor} />,
      },
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        tabBarIcon: () => <Icon name="cog" size={30} color={Constants.tertiaryBgColor} />,
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
        height: Dimensions.get('window').height * 0.075,
      },
    },
  },
);
