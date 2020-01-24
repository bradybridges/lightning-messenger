import React, { Component } from 'react';
import { Text, View } from 'react-native';
import * as firebase from 'firebase';
import ApiKeys from './ApiKeys';

export default class App extends Component {
  componentDidMount = () => {
    if(!firebase.apps.length) firebase.initializeApp(ApiKeys.FirebaseConfig);
  }
  render() {
    return (
      <View style={{paddingTop: 20}}>
        <Text> textInComponent </Text>
      </View>
    )
  }
}

