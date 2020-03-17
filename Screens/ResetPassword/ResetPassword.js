import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import * as firebase from 'firebase';
import 'firebase/auth';
import * as Constants from '../../Constants/Constants';

export default class ResetPassword extends Component {

  state = {
    email: '',
    loading: false,
  }

  handleChange = (text) => {
    this.setState({ email: text });
  }

  resetPassword = async () => {
    try {
      this.setState({ loading: true });
      const { email } = this.state;
      const { navigate } = this.props.navigation;
      if(!email) {
        alert('Please enter an email address');
        return;
      }
      await firebase.auth().sendPasswordResetEmail(email);
      alert(`A link to reset your password was sent to ${email}`);
      this.setState({ loading: false, email: '' });
      navigate('Login');
    } catch(error) {
      this.setState({ email: '' });
      if(error.code === 'auth/user-not-found') {
        alert('Unable reset password for given email');
        return;
      } else if(error.code === 'auth/invalid-email') {
        alert('Please enter a valid email address');
        return;
      }
      console.error({ error });
    }
  }

  cancelResetPassword = () => {
    const { navigate } = this.props.navigation;
    this.setState({ email: '' });
    navigate('Login');
  }

  render() {
    const { email } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.header}>Reset Password</Text>
        <TextInput 
          value={email} 
          onChangeText={this.handleChange} 
          placeholder='Email'
          style={styles.input}
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={this.resetPassword}
        >
          <Text style={styles.buttonText}>
            ResetPassword
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={this.cancelResetPassword}  
        >
          <Text style={styles.buttonText}>
            Cancel
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#14272E',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Constants.midMarginPadding,
  },
  header: {
    color: 'white',
    fontSize: 40,
    marginVertical: Constants.baseMarginPadding,
  },
  input: {
    width: Dimensions.get('window').width * .9,
    maxWidth: 400,
    height: 60,
    borderRadius: 4,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: 'white',
    marginVertical: Constants.baseMarginPadding,
  },
  button: {
    width: Dimensions.get('window').width * .8,
    backgroundColor: Constants.primaryHeaderColor, 
    height: 50, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 4,
    marginTop: Constants.baseMarginPadding,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 24,
    color: Constants.tertiaryBgColor,
  }
})

