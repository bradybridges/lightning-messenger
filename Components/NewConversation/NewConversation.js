import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import BackButton from '../BackButton/BackButton';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as Constants from '../../Constants/Constants';


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
        <Text style={styles.headerText}>To</Text>
        <TextInput style={styles.input} value={this.state.to} onChangeText={(value) => this.setState({to: value})}/>
        <TouchableOpacity style={styles.button} onPress={this.handleNewConversation}>
          <Text style={styles.text}>Start Conversation</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.primaryBgColor,
  },
  headerText: {
    color: 'white',
    fontSize: 36,
    marginTop: getStatusBarHeight() + 20,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: "700"
  },
  input: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width * .8,
    height: 50,
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    width: Dimensions.get('window').width * .5,
    backgroundColor: Constants.secondaryBgColor,
    display: 'flex',
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    borderRadius: 6,
  }
});

