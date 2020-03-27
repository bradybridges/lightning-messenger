import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import * as Constants from '../../Constants/Constants';

export default class Message extends Component {

  state = {
    showDeleteMessage: false,
  }

  formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    let hours = Number(date.getHours());
    const label = (hours >= 12) ? 'PM': 'AM';
    let minutes = Number(date.getMinutes());
    if(hours > 12) {
      hours = hours - 12;
    } else if(hours === 0) {
      hours = 12;
    }
    if(minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${hours}:${minutes} ${label}`;
  }

  renderMessage = () => {
    const { content, timestamp, isSender, deleteMessage } = this.props;
    const { showDeleteMessage } = this.state;
    const time = this.formatTimestamp(timestamp);
    if(!showDeleteMessage) {
      return (
          <TouchableOpacity activeOpacity={0.75} style={isSender ? styles.senderContainer: styles.container} onLongPress={this.toggleShowDeleteMessage}>
            <Text style={isSender ? styles.senderContent: styles.content}>{content}</Text>
            <Text style={isSender ? styles.senderTimestamp: styles.timestamp}>{time}</Text>
          </TouchableOpacity>
      );
    }
    return (
      <View style={isSender ? styles.senderContainer: styles.container}>
        <TouchableOpacity onPress={() => deleteMessage(content, isSender ? true: false)}>
          <Text>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.toggleShowDeleteMessage}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>  
    );
  }
    
  toggleShowDeleteMessage = () => {
    const { showDeleteMessage } = this.state;
    this.setState({ showDeleteMessage: !showDeleteMessage });
  }

  render() {
    // const { content, timestamp, isSender, handleDeleteMessage } = this.props;
    // const { showDeleteMessage } = this.state;
    // const time = this.formatTimestamp(timestamp);
    return this.renderMessage();
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Constants.tertiaryBgColor,
    borderRadius: 25,
    marginTop: 15,
    width: Dimensions.get('window').width * .9,
    paddingBottom: 5,
    borderColor: '#abababeb',
    borderWidth: 1,
    marginLeft: 10,
  },
  content: {
    padding: 5,
    fontSize: 18,
    color: 'black',
    fontFamily: 'exo-regular',
  },
  timestamp: {
    alignSelf: 'flex-end',
    marginRight: 20,
    color: 'black',
    fontSize: 12,
    fontFamily: 'exo-regular',
  },
  senderContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#151515',
    borderRadius: 25,
    marginTop: 15,
    width: Dimensions.get('window').width * .9,
    paddingBottom: 5,
    borderColor: '#abababeb',
    borderWidth: 1,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  senderContent: {
    padding: 5,
    fontSize: 18,
    color: 'white',
    fontFamily: 'exo-regular',
  },
  senderTimestamp: {
    alignSelf: 'flex-end',
    marginRight: 20,
    color: 'white',
    fontSize: 12,
    fontFamily: 'exo-regular',
  },
});

