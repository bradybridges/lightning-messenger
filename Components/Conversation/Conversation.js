import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Message from '../Message/Message';
import ComposeMessageForm from '../ComposeMessageForm/ComposeMessageForm';

export default class Conversation extends Component {
  renderMessages = () => {
    const { messages } = this.props;
    return messages.map((message, i) => {
      return (
        <Message 
          key={i} 
          content={message.contents} 
          timestamp={message.timestamp}
        />
      );  
    });
  }
  render() {
    const { from, messages, updateConversation } = this.props;
    const { email } = this.props.user;
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>{from}</Text>
        </View>
        <ScrollView style={styles.messagesContainer}>
          { this.renderMessages() }
        </ScrollView>
        <ComposeMessageForm from={email} to={from} updateConversation={updateConversation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height * .8,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    height: Dimensions.get('window').height * .2,
    backgroundColor: '#00000069',
    padding: 20,
  },
  header: {
    color: 'white',
    fontSize: 24,
  },
  messagesContainer: {
    width: Dimensions.get('window').width * .9,
    borderColor: 'white',
    borderWidth: 1,
  }
})

