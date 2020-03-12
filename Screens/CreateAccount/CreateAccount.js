import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Dimensions, Image, AsyncStorage } from 'react-native';
import * as firebase from 'firebase';
import * as Constants from '../../Constants/Constants';
import nacl from 'tweet-nacl-react-native-expo';
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

  handleCreateAccount = async () => {
    try {
      const { email, password, passwordConfirm } = this.state;
      if( password !== passwordConfirm) {
        alert('Passwords don\'t match...');
        return;
      }
      const user = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const publicKey = await this.handleKeyGeneration(email);
      await firebase.firestore().collection('users').doc(email).collection('friends').doc('brady@gmail.com').set({ exists: true });
      await firebase.firestore().collection('availableUsers').doc(email).set({ publicKey });
      this.props.navigation.goBack()
    } catch(error) {console.error({ error })}
  }

  handleKeyGeneration = async (email) => {
    const keyPair = await nacl.box.keyPair();
    const { publicKey, secretKey } = keyPair;
    const publicEncoded = nacl.util.encodeBase64(publicKey);
    const privateEncoded = nacl.util.encodeBase64(secretKey);
    const newUser = { inbox: [], sent: [], keys: { publicKey: publicEncoded, secretKey: privateEncoded }};
    await AsyncStorage.setItem(email, JSON.stringify(newUser));
    return publicEncoded;
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

