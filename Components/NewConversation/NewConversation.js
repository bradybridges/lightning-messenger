import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Dimensions, Button } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import BackButton from '../BackButton/BackButton';


export default class NewConversation extends Component {
  state = {
   to: '',
  }

  findReceiver = () => {
    const { to } = this.state;

  }

  handleNewConversation = async () => {
    const { to } = this.state;
    const { handleNewConversation } = this.props;
    if(!to) return;
    const userRef = await firebase.firestore().collection('users').doc(to);
    const doc = await userRef.get();
    if(!doc.exists) {
      alert('No user found with that email!');
      this.setState({ to: '' });
      return;
    }
    handleNewConversation(to);
  }

  closeNewConversation = () => {
    const { toggleNewConversation } = this.props;
    toggleNewConversation();
  }

  render() {
    return (
      <View style={styles.container}>
        <BackButton close={this.closeNewConversation} />
        <Text>To</Text>
        <TextInput value={this.state.to} onChangeText={(value) => this.setState({to: value})}/>
        <Button title="Start Conversation" onPress={this.handleNewConversation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

