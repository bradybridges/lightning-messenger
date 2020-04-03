import React, { Component } from 'react';
import { Text,  
  View, 
  TextInput, 
  Button, 
  StyleSheet, 
  Dimensions, 
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as firebase from 'firebase';
import * as Constants from '../../Constants/Constants';
import * as Font from 'expo-font';
import 'firebase/auth';
import ApiKeys from '../../ApiKeys';
const logo = require('../../assets/logo.png');


export default class Login extends Component {
  state = {
    email: '',
    password: '',
    loading: false,
    loadingFonts: true,
  }

  componentDidMount = async () => {
    await Font.loadAsync({
      'exo-regular': require('../../assets/fonts/Exo2-Regular.otf'),
    });
    this.setState({ loadingFonts: false });

    if(!firebase.apps.length) {
      await firebase.initializeApp(ApiKeys.FirebaseConfig);
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
    this.setState({ loading: true });
    const { email, password } = this.state;
    if(this.handleInputCheck(email, password)) {
      await firebase.auth().signInWithEmailAndPassword(email.toLowerCase(), password)
        .catch((error) => {
          this.setState({ error, loading: false });
          return this.returnErrorMessage(error.code);
        });
    }
    this.setState({loading: false });
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

  handleNavigation = (screen) => {
    const { navigate } = this.props.navigation;
    this.setState({ email: '', password: '' });
    navigate(screen);
  }

  render() {
    const { navigate } = this.props.navigation;
    const { loading, loadingFonts } = this.state;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.inner}>
          <Text style={styles.header}>Login</Text>
          <View style={styles.loginContainer}>
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
          </View>
          {!loadingFonts && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={this.handleLogin}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => this.handleNavigation('CreateAccount')}><Text style={styles.buttonText}>Join</Text></TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => this.handleNavigation('ResetPassword')}><Text style={styles.buttonText}>Reset Password</Text></TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14272E',
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around"
  },
  loginContainer: {
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
  header: {
    color: 'white',
    fontSize: 40,
    fontFamily: 'exo-regular',
    textAlign: 'center',
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
    fontFamily: 'exo-regular',
  }
});

