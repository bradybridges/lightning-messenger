import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Message from '../Message/Message';

export default class Conversation extends Component {
  renderMessages = () => {
    const { messages } = this.props;
    return messages.map((message, i) => {
      return (
        <Message key={i} content={message.contents} timestamp={message.timestamp} />
      );  
    });
  }
  render() {
    const { from, messages } = this.props;
    return (
      <View>
        <Text>{from}</Text>
        { this.renderMessages() }
      </View>
    )
  }
}
