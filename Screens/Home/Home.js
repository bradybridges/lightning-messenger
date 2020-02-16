import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, YellowBox, Modal } from 'react-native';
import Message from '../../Components/Message/Message';
import Conversation from '../../Components/Conversation/Conversation';
import ConversationTab from '../../Components/ConversationTab/ConversationTab';
import * as firebase from 'firebase';
import * as constants from '../../Constants/Constants';
import 'firebase/firestore';
import 'firebase/auth';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class Home extends Component {
  state = {
    conversations: [],
    user: null,
    selectedConversation: null,
    showConversation: false,
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
    const recievedSnap = await firebase.firestore().collection('messages').where('to', '==', user.email).get();
    const sentSnap = await firebase.firestore().collection('messages').where('from', '==', user.email).get();
    const recieved = recievedSnap.docs.map((doc) => doc.data());
    const sent = sentSnap.docs.map((doc) => doc.data());
    const messages = [...recieved, ...sent];
    const conversations = this.sortMessages(messages);
    this.setState({ conversations });
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
    sortedMessages.forEach((conversation) => {
      conversation.messages.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
    });
    return sortedMessages;
  }

  updateConversation = (from, newMessage) => {
    const conversations = this.state.conversations.map((convo) => convo);
    const conversation = conversations.find((convo) => convo.from === from);
    conversation.messages.push(newMessage);
    this.setState({ conversations });
  }

  formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    let hours = Number(date.getHours());
    const label = (hours >= 12) ? 'PM': 'AM';
    let minutes = Number(date.getMinutes());
    if(hours > 12) {
      hours = hours - 12;
    }
    if(minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${hours}:${minutes} ${label}`;
  }

  renderConversationTabs = () => {
    const { conversations } = this.state;
    return conversations.map((convo) => {
      const timestamp = convo.messages[convo.messages.length - 1].timestamp;
      const time = this.formatTimestamp(timestamp);
      return <ConversationTab from={convo.from} time={time} key={convo.from} updateSelectedConversation={this.updateSelectedConversation}/>;
    });
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

  // renderConversations = () => {
  //   const { messages, user } = this.state;
  //   const conversations = this.state.conversations;
  //   return conversations.map((conversation) => {
  //   return <Conversation key={conversation.from} from={conversation.from} messages={conversation.messages} user={user} updateConversation={this.updateConversation}/>;
  //   });
  // }

  renderConversation = () => {
    const { selectedConversation, user } = this.state;
    return (
      <Conversation
        from={selectedConversation.from}
        messages={selectedConversation.messages}
        user={user}
        updateConversation={this.updateConversation}
      />
    );
  }

  updateSelectedConversation = (from) => {
    const {conversations} = this.state;
    const conversation = conversations.find((convo) => convo.from === from);
    this.setState({ selectedConversation: conversation, showConversation: true });
  }

  render() {
    // setTimeout(() => {
    //   const user = this.state.user;
    //   this.getMessages(user);
    // }, 60000);
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {this.state.user && this.renderConversationTabs()}
        <Button title="LogOut" onPress={this.signOut}/>
        <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.showConversation}
        onRequestClose={() => {
          this.setState({ showConversation: false });
        }}
        >
          {this.state.selectedConversation && this.renderConversation()}
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: constants.primaryBgColor,
  },
});
