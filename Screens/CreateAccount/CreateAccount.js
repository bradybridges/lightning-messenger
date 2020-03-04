import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet, Button, Dimensions } from 'react-native';
import * as firebase from 'firebase';
import * as Constants from '../../Constants/Constants';
import 'firebase/auth';
import 'firebase/firestore';

export default class CreateAccount extends Component {
  state = {
    email: "",
    password: "",
    passwordConfirm: "",
  }

  handleChange = (field, value) => {
    this.setState({ [field]: value });
  }

  handleCreateAccount = () => {
    const { email, password, passwordConfirm } = this.state;
    if( password !== passwordConfirm) {
      alert('Passwords don\'t match...');
      return;
    }
    firebase.auth().createUserWithEmailAndPassword(email, password) 
      .then((user) => {
        firebase.firestore().collection('users').doc(user.user.email).collection('inbox').add({ from: 'Tom', contents: 'hey buddy', sent: new Date() })
      })
      .then(() => this.props.navigation.goBack())
      .catch((error) => alert(error));
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Email</Text>
        <TextInput style={styles.input} onChangeText={(value) => this.handleChange("email", value)}/>
        <Text style={styles.text}>Password</Text>
        <TextInput secureTextEntry={true} style={styles.input} onChangeText={(value) => this.handleChange("password", value)}/>
        <Text style={styles.text}>Confirm Password</Text>
        <TextInput secureTextEntry={true} style={styles.input} onChangeText={(value) => this.handleChange("passwordConfirm", value)}/>
        <Button style={styles.button} title="Create Account" onPress={this.handleCreateAccount}/>
        <Button style={styles.button} title="Cancel" onPress={() => navigate('Login')}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.primaryBgColor,
    alignItems: 'center',
    paddingTop: Dimensions.get('window').height * .1,
  },
  text: {
    fontSize: 24,
    color: 'white',
  },
  input: {
    width: Dimensions.get('window').width * .9,
    maxWidth: 400,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 4,
    fontSize: 24,
    textAlign: 'center',
  },
});

