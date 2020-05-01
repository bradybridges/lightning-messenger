import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
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

  handleDeleteMessage = async () => {
    const { content, isSender, deleteMessage } = this.props;
    await deleteMessage(content, isSender);
    this.setState({ showDeleteMessage: false });
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
    } else {
      return (
        <View style={isSender ? styles.senderContainer: styles.container}>
          <View style={styles.deleteContainer}>
            <TouchableOpacity
              onPress={this.handleDeleteMessage}
              style={styles.deleteBtn}
            >
              <Text style={isSender ? styles.senderContent: styles.content}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={this.toggleShowDeleteMessage}
              style={styles.deleteBtn}
            >
              <Text style={isSender ? styles.senderContent: styles.content}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>  
      );
    }
  }
    
  toggleShowDeleteMessage = () => {
    const { showDeleteMessage } = this.state;
    this.setState({ showDeleteMessage: !showDeleteMessage });
  }

  render() {
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
  deleteContainer: {
    width: '75%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteBtn: {
    width: '50%',
  },  
  content: {
    padding: 5,
    fontSize: 18,
    color: 'black',
    fontFamily: 'exo-regular',
    textAlign: 'center',
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
    textAlign: 'center',
  },
  senderTimestamp: {
    alignSelf: 'flex-end',
    marginRight: 20,
    color: 'white',
    fontSize: 12,
    fontFamily: 'exo-regular',
  },
});

