import React, { Component } from 'react';
import { Text, TextInput, View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
const sendImg = require('../../assets/send.png');

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
        <TextInput style={styles.input} onChangeText={this.handleChange} value={this.state.message}/>
        <TouchableOpacity style={styles.sendBtnContainer} onPress={this.sendMessage}>
          <Image source={sendImg} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width * .8,
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    width: '70%',
  },
  sendBtnContainer: {
    backgroundColor: 'black',
  }
});

