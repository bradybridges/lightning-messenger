import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Modal
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as firebase from 'firebase';
import * as Font from 'expo-font';
import 'firebase/firestore';
import 'firebase/auth';
import * as Constants from '../../Constants/Constants';
import ConfirmDeleteAccount from '../../Components/ConfirmDeleteAccount/ConfirmDeleteAccount';
import nacl from 'tweet-nacl-react-native-expo';

export default class Settings extends Component {
  state = {
    user: null,
    loadingFonts: true,
    showConfirmDeleteAccount: false,
    loading: false,
    keysGenerated: false,
    error: null,
  }

  componentDidMount = async () => {
    await Font.loadAsync({
      'expo-regular': require('../../assets/fonts/Exo2-Regular.otf'),
    });

    firebase.auth().onAuthStateChanged(async user => {
      if(user) {
        this.setState({ user, loadingFonts: false });
      } else {
        const { replace } = this.props.navigation;
        replace('Login');
      }
    });
  }

  handleKeyGeneration = async () => {
    const { user } = this.state;
    const { email } = user;
    const keyPair = await nacl.box.keyPair();
    const { publicKey, secretKey } = keyPair;
    const publicEncoded = nacl.util.encodeBase64(publicKey);
    const privateEncoded = nacl.util.encodeBase64(secretKey);
    const newKeys =  { publicKey: publicEncoded, secretKey: privateEncoded };
    await this.updateLocallyStoredKeys(email, newKeys);
    await this.updateCloudPublicKey(email, publicEncoded);
    this.setState({ keysGenerated: true });
    this.newKeysMessageTimeout();
  }

  updateLocallyStoredKeys = async (email, keys) => {
    try {
      let savedUser = await SecureStore.getItemAsync(email.replace('@', ''));
      savedUser = JSON.parse(savedUser);
      savedUser.keys = keys;
      await SecureStore.setItemAsync(email.replace('@', ''), JSON.stringify(savedUser));
    } catch(error) { this.setState({ error: 'There was a problem updating your keys' }) }
  }

  updateCloudPublicKey = async (email, publicKey) => {
    try {
      await firebase.firestore().collection('availableUsers').doc(email).set({ publicKey });
    }catch(error) { this.setState({ error: 'There was a problem updating your keys, please try again later' }) }
  }

  handleDeleteAccount = async () => {
    try {
      const { replace } = this.props.navigation;
      this.setState({ loading: true });
      const { user } = this.state;
      const email = user.email;
      await SecureStore.deleteItemAsync(email.replace('@', ''));
      const availableUserSnap = await firebase.firestore().collection('availableUsers').doc(email).delete();
      const inboxSnap = await firebase.firestore().collection('users').doc(email).collection('inbox').get();
      await inboxSnap.docs.forEach((msg) => msg.ref.delete());
      const friendsSnap = await firebase.firestore().collection('users').doc(email).collection('friends').get();
      await friendsSnap.docs.forEach((doc) => doc.ref.delete());
      await user.delete();
      await firebase.auth().signOut;
      await this.setState({ loading: false, showConfirmDeleteAccount: false });
      replace('Login');
    }catch(error) { this.setState({ error: 'There was a problem deleting your account' })}
  }

  toggleConfirmDeleteAccount = () => {
    const { showConfirmDeleteAccount } = this.state;
    this.setState({ showConfirmDeleteAccount: !showConfirmDeleteAccount });
  }

  handleClearData = async () => {
    try {
      const { replace } = this.props.navigation;
      const { user } = this.state;
      let storedProfile = await SecureStore.getItemAsync(user.email.replace('@', ''));
      storedProfile = JSON.parse(storedProfile);
      const newProfile = { inbox: [], sent: [], keys: storedProfile.keys };
      await SecureStore.setItemAsync(user.email.replace('@', ''), JSON.stringify(newProfile));
      await firebase.auth().signOut();
    } catch(error) { this.setState({ error: 'There was a problem clearing your data' }) }
  }

  newKeysMessageTimeout = () => {
    setTimeout(() => {
      this.setState({ keysGenerated: false });
    }, 3000);
  }

  errorTimeout = () => {
    setTimeout(() => {
      this.setState({ error: null });
    }, 5000);
  }

  render() {
    const { user, loadingFonts, showConfirmDeleteAccount, keysGenerated, error } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          { user && !loadingFonts && <Text style={styles.text}>{user.email}</Text> }
          { (error && !loadingFonts) && <Text style={styles.error}>{error}</Text> }
        </View>
        { keysGenerated && <Text style={styles.successMsg}>Successfully generated new keys!</Text> }
        <TouchableOpacity 
          style={styles.button}
          onPress={this.handleKeyGeneration}
        >
          <Text 
            style={!loadingFonts ? styles.buttonText: ''} 
          >
            Regenerate RSA Keys
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={this.handleClearData}
        >
          <Text 
            style={!loadingFonts ? styles.buttonText: ''} 
          >
            Clear Data
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={this.toggleConfirmDeleteAccount}
        >
          <Text 
            style={!loadingFonts ? styles.buttonText: ''} 
          >
            Delete Account
          </Text>
        </TouchableOpacity>
        <Modal visible={showConfirmDeleteAccount} onRequestClose={this.toggleConfirmDeleteAccount} animationType="slide">
            <ConfirmDeleteAccount cancelDelete={this.toggleConfirmDeleteAccount} handleDeleteAccount={this.handleDeleteAccount} />
        </Modal>
      </View>
    )
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Constants.primaryBgColor,
    paddingTop: 40,
  },
  successMsg: {
    color: Constants.tertiaryBgColor,
    fontSize: 18,
    marginVertical: 10,
    fontFamily: 'exo-regular',
  },  
  profileContainer: {
    height: Dimensions.get('window').height * .2,
  },
  friendContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
    color: 'white',
    fontFamily: 'exo-regular',
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
    padding: 10,
    width: Dimensions.get('window').width * .75,
  },
  buttonText: {
    fontSize: 24,
    color: Constants.tertiaryBgColor,
    fontFamily: 'exo-regular',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  }
});
