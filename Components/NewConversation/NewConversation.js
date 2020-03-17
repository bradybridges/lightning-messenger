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

  handleNewConversation = async () => {
    const { to } = this.state;
    const { handleNewConversation } = this.props;
    if(!to) return;
    try {
      const user = await firebase.firestore().collection('availableUsers').doc(to).get();
      if(!user.exists) {
        alert('No user found with that email!');
        this.setState({ to: '' });
        return;
      }
      handleNewConversation(to);
    } catch(err) {console.error({ err })}
  }

  closeNewConversation = () => {
    const { toggleNewConversation } = this.props;
    toggleNewConversation();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <BackButton close={this.closeNewConversation} />
          {/* <Text style={styles.titleText}>New Conversation</Text> */}
        </View>
        <Text style={styles.headerText}>To</Text>
        <TextInput style={styles.input} value={this.state.to} onChangeText={(value) => this.setState({to: value.toLowerCase() })} placeholder="Email" />
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
    alignItems: 'center',
    backgroundColor: Constants.primaryBgColor,
    paddingTop: getStatusBarHeight(),
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: Dimensions.get('window').height * .1,
    backgroundColor: Constants.primaryHeaderColor,
    padding: Constants.baseMarginPadding,
    position: 'absolute',
    zIndex: 5,
    width: '100%',
    paddingTop: getStatusBarHeight(true),
  },
  headerText: {
    color: 'white',
    fontSize: 36,
    marginTop: getStatusBarHeight() + 20,
  },
  titleText: {
    color: 'white',
    fontSize: 24,
    width: '90%',
    textAlign: 'center',
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
    backgroundColor: Constants.primaryHeaderColor,
    display: 'flex',
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    borderRadius: 6,
    color: Constants.tertiaryBgColor,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
  }
});

