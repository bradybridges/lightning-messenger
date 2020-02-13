import React, { Component } from 'react';
import { Text, TextInput, View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
const sendImg = require('../../assets/send.png');
import * as constants from '../../Constants/Constants';

export default class ComposeMessageForm extends Component {
  state = {
    message: '',
  }
  handleChange = (message) => {
    this.setState({ message });
  }
  sendMessage = () => {
    const { from, to, updateConversation } = this.props;
    const { message } = this.state;
    const sent = new Date();
    if(!message) return;
    const newMessage = {
      to,
      from,
      contents: message,
      sent,
    }
    const setDoc = firebase.firestore().collection('messages').add(newMessage)
      .then((data) => {
        console.log('Successfully created...ID: ', data.id);
        this.setState({ message: '' });
        updateConversation(to, { contents: message, timestamp: { seconds: sent }});
        return data;
      }) 
      .catch((err) => console.error('Error sending message...'));
      
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput style={styles.input} onChangeText={this.handleChange} value={this.state.message} placeholder="Send a message..."/>
        <TouchableOpacity style={styles.sendBtnContainer} onPress={this.sendMessage}>
          <Image source={sendImg} style={{width: 50, height: 50}}/>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width * .9,
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    height: 60,
    top: Dimensions.get('window').height - 90,
    zIndex: 5,
    borderRadius: 6,
  },
  input: {
    width: '80%',
    textAlign: 'center',
    fontSize: 18,
  },
  sendBtnContainer: {
    backgroundColor: constants.primaryBgColor,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 6,
    width: '20%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

