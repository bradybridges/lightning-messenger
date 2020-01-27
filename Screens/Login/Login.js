import React, { Component } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/auth';
import ApiKeys from '../../ApiKeys';


export default class Login extends Component {
  state = {
    email: '',
    password: '',
    user: null,
  }

  componentDidMount = () => {
    if(!firebase.apps.length) {
      firebase.initializeApp(ApiKeys.FirebaseConfig);
    } 
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'Home' : 'Login')
      this.setState({ user });
    })
  }

  handleEmailChange = (email) => {
    this.setState({ email });
  }

  handlePasswordChange = (password) => {
    this.setState({ password });
  }

  handleLogin = () => {
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((error) => {
        this.setState({ error });
        alert(error.message);
        alert(error.code);
      })
  }

  render() {
    return (
      <View>
        <Text>Email</Text>
        <TextInput
          value={this.state.email}
          onChangeText={this.handleEmailChange}
        />
        <Text>Password</Text>
        <TextInput
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={this.handlePasswordChange}
        />
        <Button title="Login" onPress={this.handleLogin}/>
      </View>
    )
  }
}
