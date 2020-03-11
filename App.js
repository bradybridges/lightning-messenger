import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './Screens/Home/Home';
import Login from './Screens/Login/Login';
import CreateAccount from './Screens/CreateAccount/CreateAccount';
import SignoutIconButton from './Components/SignoutIconButton/SignoutIconButton';
import { View, Text, Image, BlurView, StyleSheet } from 'react-native';

const MainNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      headerShown: false,
    }
  },
  Home: {
    screen: Home, 
    navigationOptions: {
      headerRight: () => <SignoutIconButton />, 
      headerTitle: () => renderLogo(),
      headerTitleAlign: () => 'center',
      headerStyle: {
        backgroundColor: 'black',
      },
    },
  },
  CreateAccount: { 
    screen: CreateAccount ,
    navigationOptions: {
      headerShown: false,
    }
  },
});

const renderLogo = () => {
  return (
    <View>
      <Image source={require('./assets/logo.png')} style={{ width: 50, height: 50 }} />
    </View>
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
