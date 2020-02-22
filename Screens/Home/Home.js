import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, YellowBox, Modal, ScrollView, AsyncStorage } from 'react-native';
import Message from '../../Components/Message/Message';
import Conversation from '../../Components/Conversation/Conversation';
import ConversationTab from '../../Components/ConversationTab/ConversationTab';
import NewMessageButton from '../../Components/NewMessageButton/NewMessageButton';
import NewConversation from '../../Components/NewConversation/NewConversation';
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
    showNewConversation: false,
  };


  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({ user });
        this.getMessages(user);
      } else {
        const { replace } = this.props.navigation;
        replace('Login');
      }
    });
  }
  
  getMessages = async (user) => {  
    try{
      const inboxSnap = await firebase.firestore().collection('users').doc(user.email).collection('inbox').get();
      const inbox = await inboxSnap.docs.map((doc) => doc.data());
      // const conversations = this.sortMessages(inbox);
      if(inbox.length) {
        await this.saveNewMessages(inbox);
      }
      const messages = await this.buildMessages();
      const conversations = this.sortMessages(messages);
      this.setState({ conversations });
    } catch(error) {console.log({error});}
  };

  buildMessages = async () => {
    const sentStringy = await AsyncStorage.getItem('sent');
    const inboxStringy = await AsyncStorage.getItem('inbox');
    if(sentStringy === null && inboxStringy === null) {
      const date = new Date();
      return [{ from: 'Tom', contents: 'Welcome to lightning messenger', timestamp: { seconds: date.getTime() / 1000 }}];
    } else if( sentStringy === null) {
      const inbox = await JSON.parse(inboxStringy);
      console.log('inbox');
      return inbox;
    } else if(inboxStringy === null) {
      const sent = await JSON.parse(sentStringy);
      console.log('sent');
      return sent;
    } else {
      const inbox = await JSON.parse(inboxStringy);
      const sent = await JSON.parse(sentStringy);
      console.log('inbox/sent');
      return [...inbox, ...sent];
    }
  }

  saveNewMessage = async (message) => {

  }

  saveNewMessages = async (messages) => {
    const stringyInbox = await AsyncStorage.getItem('inbox');
    if(stringyInbox !== null) {
      const inbox = await JSON.parse(stringyInbox);
      // await AsyncStorage.setItem('inbox', JSON.stringify([...inbox, ...messages]));
    } else if(stringInbox === null && messages.length === 0) {
      // await AsyncStorage.setItem('inbox', JSON.stringify([]));
    } else {
      // await AsyncStorage.setItem('inbox', JSON.stringify(messages));
    }
  }

  sortMessages = (messages) => {
    const { email } = this.state.user;
    const sortedMessages = messages.reduce((conversations, curMessage) => {
      const existingConvo = conversations.findIndex((convo) => {
        if(convo.from == curMessage.from) {
          return true;
        }
        if(convo.from === curMessage.to) {
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

  updateConversation = (from, newMessage) => {
    const conversations = this.state.conversations.map((convo) => convo);
    const conversation = conversations.find((convo) => convo.from === from);
    if(!conversation) {
      return;
    }
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
      let time;
      if(convo.messages.length) {
        const timestamp = convo.messages[convo.messages.length - 1].timestamp;
        time = this.formatTimestamp(timestamp);
      } else {
        time = 'New';
      }
      return (
        <ConversationTab 
          from={convo.from} 
          time={time} 
          key={convo.from} 
          updateSelectedConversation={this.updateSelectedConversation} 
        />
      );
    });
  }

  toggleNewConversation = () => {
    this.setState({ showNewConversation: !this.state.showNewConversation });
  }

  renderMessages = () => {
    return this.state.messages.map((message, i) => {
      return (
        <Message key={i} message={message.contents} timestamp={message.sent} />
      );  
    });
  }

  renderConversation = () => {
    const { selectedConversation, user } = this.state;
    return (
      <Conversation
        from={selectedConversation.from}
        messages={selectedConversation.messages}
        user={user}
        updateConversation={this.updateConversation}
        closeSelectedConversation={this.closeSelectedConversation}
      />
    );
  }

  updateSelectedConversation = (from) => {
    const {conversations} = this.state;
    const conversation = conversations.find((convo) => convo.from === from);
    this.setState({ selectedConversation: conversation, showConversation: true });
  }

  handleNewConversation = (receiver) => {
    let conversations = this.state.conversations.map((convo) => convo);
    const newConversation = {
      from: receiver,
      messages: [],
    }
    conversations.push(newConversation);
    this.setState(
      { 
        conversations, 
        selectedConversation: newConversation, 
        showConversation: true, 
        showNewConversation: false,
      }
    );
  }

  closeSelectedConversation = () => {
    this.setState({ selectedConversation: null, showConversation: false });
  }

  render() {
    // setTimeout(() => {
    //   const user = this.state.user;
    //   this.getMessages(user);
    // }, 10000);
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {/* <Text style={{ color: 'white', fontSize: 64 }}>Testing!!!</Text> */}
        <ScrollView>
          {this.state.user && this.renderConversationTabs()}
        </ScrollView>
        <NewMessageButton toggleNewConversation={this.toggleNewConversation}/>
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
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.showNewConversation}
          onRequestClose={() => {
            this.setState({ showNewConversation: false });
          }}
        >
          <NewConversation handleNewConversation={this.handleNewConversation} toggleNewConversation={this.toggleNewConversation}/>
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
