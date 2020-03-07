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

  handleLogin = () => {
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((error) => {
        this.setState({ error });
        alert(error.message);
        alert(error.code);
      });
    this.setState({ email: '', password: '' });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Image source={logo} style={{ width: 200, height: 200 }}/>
        <Text style={styles.header}>Lightning Messenger</Text>
        <KeyboardAvoidingView style={styles.loginContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={this.state.email}
            onChangeText={this.handleEmailChange}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={this.handleLogin}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigate('CreateAccount')}><Text style={styles.buttonText}>Create Account</Text></TouchableOpacity>
          </View>

          </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.primaryBgColor,
    flex: 1,
    alignItems: 'center',
    paddingTop: Dimensions.get('window').height * .1,
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
  label: {
    color: 'white',
    fontSize: 24,
  },
  loginContainer: {
    height: 400,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  buttonContainer: {
    width: Dimensions.get('window').width * .8,
    height: 140,
    display: 'flex',
    justifyContent: 'space-evenly',
  },  
  header: {
    color: 'white',
    fontSize: 40,
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

