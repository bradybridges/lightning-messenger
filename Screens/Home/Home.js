import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import Message from '../../Components/Message/Message';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

export default class Home extends Component {
  state = {
    messages: [],
    user: null,
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({ user });
        this.getMessages(user);
      } else {
        const { navigate } = this.props.navigation;
        navigate('Login');
      }
    });
  }
  
  getMessages = async (user) => {  
    const snapshot = await firebase.firestore().collection('messages').where( 'to', '==', user.email).get();
    const messages = await snapshot.docs.map((doc) => doc.data());
    this.setState({ messages });  
    console.log('SORTED MESSAGES: ', this.sortMessages(messages));
  };

  sortMessages = (messages) => {
    const sortedMessages = messages.reduce((conversations, curMessage) => {
      const existingConvo = conversations.findIndex((convo) => convo.from == curMessage.from);
      if(existingConvo > -1) {
        const newMessage = curMessage.contents;
        conversations[existingConvo].messages.push(newMessage);
      } else {
        const newConvo = {
          from: curMessage.from,
          messages: [curMessage.contents],
        };
        conversations.push(newConvo);
      }
      return conversations;
    }, []);
    return sortedMessages;
  }

  signOut = () => {
    firebase.auth().signOut();
  }

  renderMessages = () => {
    return this.state.messages.map((message, i) => {
      return (
        <Message key={i} message={message.contents} timestamp={message.sent} />
      );  
    });
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {(this.state.messages.length) ? this.renderMessages(): <Text>No Messages :/</Text>}
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

