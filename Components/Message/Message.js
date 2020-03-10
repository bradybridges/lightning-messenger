import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import * as Constants from '../../Constants/Constants';

export default class Message extends Component {
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
  render() {
    const { content, timestamp, isSender } = this.props;
    const time = this.formatTimestamp(timestamp);
    return (
      <View style={isSender ? styles.senderContainer: styles.container}>
        <Text style={isSender ? styles.senderContent: styles.content}>{content}</Text>
        <Text style={isSender ? styles.senderTimestamp: styles.timestamp}>{time}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Constants.secondaryBgColor,
    borderRadius: 25,
    marginVertical: 15,
    width: Dimensions.get('window').width * .9,
    paddingBottom: 5,
    borderColor: '#abababeb',
    borderWidth: 1,
    marginLeft: 10,
  },
  content: {
    padding: 5,
    fontSize: 18,
    color: 'white',
  },
  timestamp: {
    alignSelf: 'flex-end',
    marginRight: 20,
    color: 'white',
    fontSize: 12,
  },
  senderContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#151515',
    borderRadius: 25,
    marginVertical: 15,
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
    color: 'white'
  },
  senderTimestamp: {
    alignSelf: 'flex-end',
    marginRight: 20,
    color: 'white',
    fontSize: 12,
  },
});

