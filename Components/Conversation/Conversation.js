import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Message from '../Message/Message';

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
    const { from, messages } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>{from}</Text>
        </View>
        <ScrollView style={styles.messagesContainer}>
          { this.renderMessages() }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    height: Dimensions.get('window').height * .2,
    backgroundColor: '#00000069',
  },
  header: {
    color: 'white',
    fontSize: 24,
    padding: 20,
  },
  messagesContainer: {
    width: Dimensions.get('window').width * .9,
  }
})

