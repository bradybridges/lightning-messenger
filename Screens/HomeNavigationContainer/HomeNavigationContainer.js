import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Home from '../Home/Home';
import Friends from '../Friends/Friends';
import Settings from '../Settings/Settings';

export default createBottomTabNavigator({
  Home: { screen: Home },
  Friends: { screen: Friends },
  Settings: { screen: Settings },
});
