import React, { Component } from 'react';
import { Text,  
  View, 
  TextInput, 
  Button, 
  StyleSheet, 
  Dimensions, 
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import * as firebase from 'firebase';
import * as Constants from '../../Constants/Constants';
import 'firebase/auth';
import ApiKeys from '../../ApiKeys';
const logo = require('../../assets/logo.png');


export default class Login extends Component {
  state = {
    email: '',
    password: '',
  }

  componentDidMount = () => {
    if(!firebase.apps.length) {
      firebase.initializeApp(ApiKeys.FirebaseConfig);
    } 
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.props.navigation.replace('Home');
      }
    });
  }

  handleEmailChange = (email) => {
    this.setState({ email });
  }

  handlePasswordChange = (password) => {
    this.setState({ password });
  }

  handleLogin = async () => {
    const { email, password } = this.state;
    if(this.handleInputCheck(email, password)) {
      await firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((error) => {
          this.setState({ error });
          return this.returnErrorMessage(error.code);
        });
    }
  }

  handleInputCheck = (email, password) => {
    if(!email && !password) {
      alert('Please enter email and password');
    } else if(!email) {
      this.setState({ password: '' })
      alert('Please enter your email');
    } else if(!password) {
      alert('Please enter you password');
    }
    if(!email || !password) {
      return false;
    }
    return true;
  }

  returnErrorMessage = (code) => {
    switch(code) {
      case 'auth/wrong-password':
        this.setState({ password: '' });
        alert('Incorrect Username or Password');
        break;
      case 'auth/user-not-found':
        alert('Incorrect Username or Password');
        break;
      case 'auth/invalid-email':
        alert('Please enter an email address');
        break;
      default:
        alert(code, 'hi');
        break;
    }
  }

  handleNavigationToCreateAccount = () => {
    const { navigate } = this.props.navigation;
    this.setState({ email: '', password: '' });
    navigate('CreateAccount');
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Login</Text>
        <KeyboardAvoidingView style={styles.loginContainer}>
          <TextInput
            style={styles.input}
            value={this.state.email}
            onChangeText={this.handleEmailChange}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder="Password"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={this.handleLogin}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={ this.handleNavigationToCreateAccount}><Text style={styles.buttonText}>Join</Text></TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
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
  label: {
    color: 'white',
    fontSize: 24,
  },
  loginContainer: {
    height: 400,
    display: 'flex',
    alignItems: 'center',
  },
  buttonContainer: {
    width: Dimensions.get('window').width * .8,
  },  
  header: {
    color: 'white',
    fontSize: 40,
    marginVertical: Constants.baseMarginPadding,
  },
  button: { 
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
});

