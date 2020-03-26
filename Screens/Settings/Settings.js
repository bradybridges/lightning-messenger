import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import * as Constants from '../../Constants/Constants';

export default class Settings extends Component {
  state = {
    user: null,
  }

  componentDidMount = async () => {
    const user = await firebase.auth().currentUser;
    if(user) {
      this.setState({ user });
    }
  }

  render() {
    const { user } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          { user && <Text style={styles.text}>{user.email}</Text> }
          <View style={styles.friendContainer}>
            <Text style={styles.text}>Friends: </Text>
            <Text style={styles.text}>num friends</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Regenerate RSA Keys</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Delete Account</Text></TouchableOpacity>
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
  }
});
