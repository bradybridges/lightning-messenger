import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Message from '../Message/Message';
import ComposeMessageForm from '../ComposeMessageForm/ComposeMessageForm';
import BackButton from '../BackButton/BackButton';
import * as constants from '../../Constants/Constants';

export default class Conversation extends Component {
  renderMessages = () => {
    const { messages } = this.props;
    return messages.map((message, i) => {
      return (
        <Message 
          key={i} 
          content={message.contents} 
          timestamp={message.timestamp}
          isSender={message.sender === true ? true: false}
        />
      );  
    });
  }
  render() {
    const { from, messages, updateConversation, closeSelectedConversation } = this.props;
    const { email } = this.props.user;
    return (
      <View style={styles.container}>
        <BackButton close={closeSelectedConversation} />
        <View style={styles.headerContainer}>
          <Text style={styles.header}>{from}</Text>
        </View>
        <View style={styles.messagesContainer}>
          <ScrollView contentContainerStyle={{ display: 'flex' }}>
            { this.renderMessages() }
          </ScrollView>
        </View>
        <ComposeMessageForm from={email} to={from} updateConversation={updateConversation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: constants.primaryBgColor,
    justifyContent: 'flex-start',
    paddingTop: Dimensions.get('window').height * .1,
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    height: Dimensions.get('window').height * .1,
    backgroundColor: '#00000069',
    padding: 10,
    position: 'absolute',
    zIndex: 5,
    width: '100%',
    justifyContent: 'center',
  },
  header: {
    color: 'white',
    fontSize: 24,
  },
  messagesContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * .9,
  }
})

