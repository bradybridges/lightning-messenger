import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';

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
    const { content, timestamp } = this.props;
    const time = this.formatTimestamp(timestamp);
    return (
      <View style={styles.container}>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.timestamp}>{time}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 100,
    marginVertical: 20,
  },
  content: {
    padding: 10,
    fontSize: 18,
  },
  timestamp: {
    alignSelf: 'flex-end',
    marginRight: 20,
  }
});

