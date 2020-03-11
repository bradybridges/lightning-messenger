import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
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
        firebase.firestore().collection('users').doc(user.user.email).collection('friends').doc('brady@gmail.com').set({ exists: true });
        firebase.firestore().collection('availableUsers').doc(user.user.email).set({ exists: true });
      })
      .then(() => this.props.navigation.goBack())
      .catch((error) => alert(error));
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Image source={require('../../assets/logo.png')} style={{ width: 150, height: 150 }}/>
        <Text style={styles.header}>Lightning Messenger</Text>
        <Text style={styles.text}>Email</Text>
        <TextInput style={styles.input} onChangeText={(value) => this.handleChange("email", value)}/>
        <Text style={styles.text}>Password</Text>
        <TextInput secureTextEntry={true} style={styles.input} onChangeText={(value) => this.handleChange("password", value)}/>
        <Text style={styles.text}>Confirm Password</Text>
        <TextInput secureTextEntry={true} style={styles.input} onChangeText={(value) => this.handleChange("passwordConfirm", value)}/>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.handleCreateAccount}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigate('Login')}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: 'white',
    fontSize: 40,
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
  buttonContainer: {
    width: Dimensions.get('window').width * .8,
    height: 140,
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  button: { 
    backgroundColor: 'white', 
    height: 50, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 24,
  }
});

