import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import Message from '../../Components/Message/Message';
import Conversation from '../../Components/Conversation/Conversation';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

export default class Home extends Component {
  state = {
    messages: [],
    user: null,
    selectedConversation: null,
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
    // const snapshot = await firebase.firestore().collection('messages').where( 'to', '==', user.email).get();
    // let messages = await snapshot.docs.map((doc) => doc.data());
    // const sentSnapshot = await firebase.firestore().collection('messages').where('from', '==', user.email).get();
    // const sent = sentSnapshot.docs.map((doc) => doc.data());
    // messages = [...messages, ...sent];
    // this.setState({ messages });
    const recievedSnap = await firebase.firestore().collection('messages').where('to', '==', user.email).get();
    const sentSnap = await firebase.firestore().collection('messages').where('from', '==', user.email).get();
    const recieved = recievedSnap.docs.map((doc) => doc.data());
    const sent = sentSnap.docs.map((doc) => doc.data());
    const messages = [...recieved, ...sent];
    this.setState({ messages });
  };

  sortMessages = (messages) => {
    const { email } = this.state.user;
    const sortedMessages = messages.reduce((conversations, curMessage) => {
      const existingConvo = conversations.findIndex((convo) => {
        if((convo.from == curMessage.from) || (email == curMessage.from)) {
          return true;
        }
      });
      if(existingConvo > -1) {
        const newMessage = { contents: curMessage.contents, timestamp: curMessage.sent };
        conversations[existingConvo].messages.push(newMessage);
      } else {
        const newMessage = { contents: curMessage.contents, timestamp: curMessage.sent };
        const newConvo = {
          from: curMessage.from,
          messages: [newMessage],
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

  renderConversations = () => {
    const { messages, user } = this.state;
    const conversations = this.sortMessages(messages);
    return conversations.map((conversation) => {
    return <Conversation key={conversation.from} from={conversation.from} messages={conversation.messages} user={user}/>;
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {this.state.user && this.renderConversations()}
        <Button title="LogOut" onPress={this.signOut}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
})

