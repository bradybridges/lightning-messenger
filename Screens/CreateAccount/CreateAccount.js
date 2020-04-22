import React, { Component } from 'react';
import { 
  Text,
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Image, 
  AsyncStorage,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform, 
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as firebase from 'firebase';
import * as Constants from '../../Constants/Constants';
import * as Font from 'expo-font';
import nacl from 'tweet-nacl-react-native-expo';
import 'firebase/auth';
import 'firebase/firestore';

export default class CreateAccount extends Component {
  state = {
    email: "",
    password: "",
    passwordConfirm: "",
    loading: false,
    loadingFonts: true,
    error: null,
  }

  componentDidMount = async () => {
    await Font.loadAsync({
      'exo-regular': require('../../assets/fonts/Exo2-Regular.otf'),
    });
    this.setState({ loadingFonts: false });
  }

  handleChange = (field, value) => {
    this.setState({ [field]: value });
  }

  handleCreateAccount = async () => {
    try {
      this.setState({ loading: true });
      const { email, password, passwordConfirm } = this.state;
      if(this.validateInputs(email, password, passwordConfirm)) {
        const lowercaseEmail = email.toLowerCase();
        const user = await firebase.auth().createUserWithEmailAndPassword(lowercaseEmail, password);
        const publicKey = await this.handleKeyGeneration(lowercaseEmail);
        await firebase.firestore().collection('availableUsers').doc(lowercaseEmail).set({ publicKey });
        this.props.navigation.goBack();
      }
      this.setState({ loading: false });
    } catch(error) {
      this.setState({ loading: false, email: '', password: '', passwordConfirm: '' });
      if(error.code === 'auth/invalid-email') {
        alert('Please enter a valid email address');
      } else if(error.code === 'auth/email-already-in-use') {
        alert('An account cannot be created under that email');
      }else {
        alert('There was a problem creating your account, please try again later');
      }
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
    await SecureStore.setItemAsync(email.replace('@', ''), JSON.stringify(newUser));
    return publicEncoded;
  }

  render() {
    const { loadingFonts } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height' }
        style={styles.container}
      >
        <View style={styles.inner}>
          { !loadingFonts && <Text style={styles.header}>Create Account</Text>}
          <View style={styles.inputContainer}>
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
              placeholder='Password Confirm' 
              value={this.state.passwordConfirm}
            />
          </View>
          { !loadingFonts && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={this.handleCreateAccount}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigate('Login')}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
          <ActivityIndicator 
            animating={this.state.loading} 
            size='large' 
            color={Constants.tertiaryBgColor}        
            style={{ position: 'absolute', top: '30%', right: '50%' }}   
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: Constants.primaryBgColor,
  },
  header: {
    color: 'white',
    fontSize: 40,
    marginVertical: Constants.baseMarginPadding,
    fontFamily: 'exo-regular',
    textAlign: 'center',
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
  inputContainer: {
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
    fontFamily: 'exo-regular',
  }
});

