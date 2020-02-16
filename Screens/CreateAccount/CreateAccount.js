import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet, Button } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/auth';

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
      .catch((error) => alert(error.code));
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Email</Text>
        <TextInput onChangeText={(value) => this.handleChange("email", value)}/>
        <Text>Password</Text>
        <TextInput onChangeText={(value) => this.handleChange("password", value)}/>
        <Text>Confirm Password</Text>
        <TextInput onChangeText={(value) => this.handleChange("passwordConfirm", value)}/>
        <Button title="Create Account" onPress={this.handleCreateAccount}/>
        <Button title="Cancel" onPress={() => navigate('Login')}/>
      </View>
    )
  }
}
