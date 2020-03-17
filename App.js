import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './Screens/Home/Home';
import Login from './Screens/Login/Login';
import CreateAccount from './Screens/CreateAccount/CreateAccount';
import SignoutIconButton from './Components/SignoutIconButton/SignoutIconButton';
import ResetPassword from './Screens/ResetPassword/ResetPassword';
import { View, Text, Image, BlurView, StyleSheet, TouchableOpacity, Button } from 'react-native';
import * as Constants from './Constants/Constants';

const MainNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      // headerRight: () => renderJoinButton(),
      headerTitle: () => renderLogo(),
      headerTitleAlign: () => 'center',
      headerStyle: {
        backgroundColor: Constants.primaryHeaderColor,
      }
    }
  },
  Home: {
    screen: Home, 
    navigationOptions: {
      headerRight: () => <SignoutIconButton />, 
      headerTitle: () => renderLogo(),
      headerTitleAlign: () => 'center',
      headerStyle: {
        backgroundColor: Constants.primaryHeaderColor,
      },
    },
  },
  CreateAccount: { 
    screen: CreateAccount,
    navigationOptions: {
      headerTitle: () => renderLogo(),
      headerTitleAlign: () => 'center',
      headerLeft: () => null,
      headerStyle: {
        backgroundColor: Constants.primaryHeaderColor,
      },
    }
  },
  ResetPassword: {
    screen: ResetPassword,
    navigationOptions: {
      headerTitle: () => renderLogo(),
      headerTitleAlign: () => 'center',
      headerLeft: () => null,
      headerStyle: {
        backgroundColor: Constants.primaryHeaderColor,
      },
    }
  }
});

const renderJoinButton = () => {
  return (
    <TouchableOpacity onPress={(navigation) => navigation.navigate('CreateAccount')}>
      <Text style={{ color: 'white', fontSize: 20 }}>Join</Text>
    </TouchableOpacity>
  );
}

const renderLogo = () => {
  return (
    <Text style={{ color: Constants.tertiaryBgColor, fontSize: 24 }}>Lightning Messenger</Text>
  );
}

const title = () => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>LightningMessenger</Text>
      <Image 
        source={require('./assets/logo.png')}
        style={{ width: 100, height: 100 }}       
      />
    </View>
  )
}

const App = createAppContainer(MainNavigator);

export default App;
