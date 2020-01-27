import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';

export default class Home extends Component {
  state = {
    messages: [],
  };
  getMessages = async () => {
    const snapshot = await firebase.firestore().collection('messages').get();
    const messages = snapshot.docs.map((doc) => doc.data());
    this.setState({ messages });
  }

  renderMessages = () => {
    return this.state.messages.map((message) => {
      return (
        <View key={message.contents}>
          <Text>{message.to}</Text>
          <Text>{message.from}</Text>
          <Text>{message.contents}</Text>
          <Text>{message.sent.seconds}</Text>
        </View>
      );  
    });
  }

  render() {
    if(!this.state.messages.length) {
      this.getMessages();
    }
    const { navigate } = this.props.navigation;
    return (
      <View>
        {(this.state.messages.length) ? this.renderMessages(): <Text>Loading...</Text>}
        <Button title="click me" onPress={() => navigate('Login')}/>
      </View>
    )
  }
}
