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
      if(this.validateInputs(email, password, passwordConfirm)) {
        const user = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const publicKey = await this.handleKeyGeneration(email);
        await firebase.firestore().collection('users').doc(email).collection('friends').doc('brady@gmail.com').set({ exists: true });
        await firebase.firestore().collection('availableUsers').doc(email).set({ publicKey });
        this.props.navigation.goBack()
      }
    } catch(error) {
      if(error.code === 'auth/invalid-email') {
        this.setState({ email: '', password: '', passwordConfirm: '' });
        alert('Please enter a valid email address');
        return;
      }
      console.error({ error });
    }
  }

  validateInputs = (email, password, passwordConfirm) => {
    if(!email && !password && !passwordConfirm) {
      alert('Please complete the form');
    } else if(!password && !passwordConfirm) {
      alert('Please enter a password and confirm it')
    } else if(!email) {
      alert('Please enter an email');
    } else if(!password) {
      alert('Please enter a password');
    } else if(!passwordConfirm) {
      alert('Please verify your password');
    } else if(password !== passwordConfirm) {
      this.setState({ password: '', passwordConfirm: '' })
      alert('Password don\'t match');
    }
    if(!email || !password || !passwordConfirm || (password !== passwordConfirm)) {
      return false;
    }
    return true;
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
        <Text style={styles.header}>Create Account</Text>
        <TextInput 
          style={styles.input} 
          onChangeText={(value) => this.handleChange("email", value)} 
          placeholder="Email" 
          value={this.state.email}
        />
        <TextInput 
          secureTextEntry={true} 
          style={styles.input} 
          onChangeText={(value) => this.handleChange("password", value)}
          placeholder='Password' 
          value={this.state.password}
        />
        <TextInput 
          secureTextEntry={true} 
          style={styles.input} 
          onChangeText={(value) => this.handleChange("passwordConfirm", value)} 
          placeholder='Confirm Password' 
          value={this.state.passwordConfirm}            
        />
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
    backgroundColor: Constants.primaryBgColor,
    alignItems: 'center',
    paddingTop: Constants.baseMarginPadding,
  },
  header: {
    color: 'white',
    fontSize: 40,
    marginVertical: Constants.baseMarginPadding,
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
    marginVertical: Constants.baseMarginPadding,
  },
  buttonContainer: {
    width: Dimensions.get('window').width * .8,
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  button: { 
    backgroundColor: Constants.primaryHeaderColor, 
    height: 50, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 4,
    marginVertical: Constants.baseMarginPadding,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 24,
    color: Constants.tertiaryBgColor,
  }
});

