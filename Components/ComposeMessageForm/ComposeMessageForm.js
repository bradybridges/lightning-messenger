import React, { Component } from 'react';
import { Text, TextInput, View, Image, TouchableOpacity, StyleSheet, Dimensions, AsyncStorage } from 'react-native';
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

  sendMessage = async () => {
    const { message } = this.state;
    if(!message) return;
    const { from, to, updateConversation } = this.props;
    const sent = new Date();
    const sentSeconds = Math.floor(sent.getTime() / 1000);
    const newMessage = {
      from,
      contents: message,
      sent, //possible issue with incorrect time here
    };
    const sentMessage = {
      to,
      contents: message,
      sent: { seconds: sentSeconds },
    };
    try {
      await firebase.firestore().collection('users').doc(to).collection('inbox').add(newMessage);
      this.setState({message: '' });
      updateConversation(to, { contents: message, timestamp: { seconds: sentSeconds }});
      await this.saveSentMessage(sentMessage);
    } catch(error) { console.log(error); }
  }

  saveSentMessage = async (newMessage) => {
    const { from } = this.props;
    try{
      const stringySavedMessages = await AsyncStorage.getItem(from);
      const savedMessages = JSON.parse(stringySavedMessages);
      savedMessages.sent.push(newMessage);
      await AsyncStorage.setItem(from, JSON.stringify(savedMessages));
    } catch(err) {console.error({ err })}   
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

