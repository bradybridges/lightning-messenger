import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';


export default class Home extends Component {
  state = {
    messages: [],
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'Home' : 'Login');
    });
  };

  getMessages = async () => {
    const snapshot = await firebase.firestore().collection('messages').get();
    const messages = snapshot.docs.map((doc) => doc.data());
    this.setState({ messages });
  };

  signOut = () => {
    const response = firebase.auth().signOut();
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
      <View style={styles.container}>
        {(this.state.messages.length) ? this.renderMessages(): <Text>Loading...</Text>}
        <Button title="LogOut" onPress={this.signOut}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  }
})

