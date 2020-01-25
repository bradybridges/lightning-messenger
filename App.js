import React, { Component } from 'react';
import { Text, View } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import ApiKeys from './ApiKeys';
import Header from './Components/Header/Header';

export default class App extends Component {
  state = {
    messages: [],
  }
  componentDidMount = async () => {
    if(!firebase.apps.length) {
      await firebase.initializeApp(ApiKeys.FirebaseConfig);
      this.getUsers();
    } 
  }
  getUsers = async () => {
    const snapshot = await firebase.firestore().collection('messages').get();
    const messages = snapshot.docs.map((doc) => doc.data());
    this.setState({ messages });
  }
  renderMessages = () => {
    return this.state.messages.map((message) => {
      return (
        <View>
          <Text>{message.to}</Text>
          <Text>{message.from}</Text>
          <Text>{message.contents}</Text>
          <Text>{message.sent.seconds}</Text>
        </View>
      );  
    });
  }
  render() {
    return (
      <View style={{paddingTop: 20}}>
        <Header />
        {this.state.messages.length !== 0 && this.renderMessages()}
      </View>
    )
  }
}


