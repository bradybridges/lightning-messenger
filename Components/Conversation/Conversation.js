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
        <View style={styles.messagesContainer}>
          <ScrollView>
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
    backgroundColor: 'black',
    justifyContent: 'flex-start',
    
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
    height: Dimensions.get('window').height * .8,
  }
})

