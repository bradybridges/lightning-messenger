import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Dimensions, Button } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/storage';


export default class NewConversation extends Component {
  state = {
   to: '',
  }

  findReceiver = () => {
    const { to } = this.state;

  }

  handleNewConversation = () => {
    const { to } = this.state;
    if(!to) return;
    //try and find the user 
    //if the user exists proceed with process
    //otherwise alert user not found
    //trigger handleNewConversation
    //toggle current modal off
    //set selected convo
    //toggle convo modal
  }

  render() {
    return (
      <View>
        <Text>To</Text>
        <TextInput />
        <Button title="Start Conversation" onPress={this.handleNewConversation}/>
      </View>
    );
  }
}
