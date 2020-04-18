import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import BackButton from '../BackButton/BackButton';
import * as firebase from 'firebase';
import 'firebase/firestore';
import * as Constants from '../../Constants/Constants';

export default class SearchFriends extends Component {
  state = {
    searchResult: null,
    search: '',
    noUserFound: false,
  };

  handleChange = (value) => {
    this.setState({ search: value });
  }

  handleSearch = async () => {
    try {
      const { search } = this.state;
      const { friends } = this.props;
      const lowerCaseSearch = search.toLowerCase();
      if(search === '') {
        alert('Please enter an email address');
        return;
      }
      if(friends.includes(lowerCaseSearch)) {
        this.setState({ search: '' });
        alert(`You and ${lowerCaseSearch} are already friends!`);
        return;
      }
      const userSnap = await firebase.firestore().collection('availableUsers').doc(lowerCaseSearch).get();
      if(userSnap.exists) {
        this.setState({ searchResult: userSnap.id, search: '' });
        return;
      }
      this.setState({ noUserFound: true, search: '', searchResult: null });
      this.noUserMessageTimeout();
    } catch(error) { console.error({ error })}
  }

  noUserMessageTimeout = () => {
    setTimeout(() => {
      this.setState({ noUserFound: false });
    }, 3000);
  }

  handleSendRequest = async () => {
    try{
      const { searchResult } = this.state;
      const { handleSendRequest } = this.props;
      await handleSendRequest(searchResult);
      this.setState({ searchResult: null });
    } catch(error) { console.error({ error })}
  }

  renderResults = () => {
    const { searchResult } = this.state;
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{searchResult}</Text>
        <TouchableOpacity style={styles.sendReqBtn}>
          <Text style={styles.sendReqBtnText} onPress={this.handleSendRequest}>
            Send Request
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { searchResult, search, noUserFound } = this.state;
    const { toggleShowAddFriend } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.header}>Find Friends</Text>
          <TextInput 
            placeholder="Email" 
            value={search} 
            onChangeText={this.handleChange} 
            style={styles.input}
          />
          <TouchableOpacity 
            onPress={this.handleSearch}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              Search For Friend
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={toggleShowAddFriend}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
        {searchResult && this.renderResults()}
        { noUserFound && <Text style={styles.text}>No user found!</Text> }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.primaryBgColor,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    color: Constants.tertiaryBgColor,
  },  
  formContainer: {
    height: Dimensions.get('window').height * .4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: Constants.primaryHeaderColor,
    justifyContent: 'space-evenly',
    borderBottomColor: Constants.tertiaryBgColor,
    borderBottomWidth: 1,
  }, 
  input: {
    width: '75%',
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: 6,
    height: 50,
    fontSize: 20,
    fontFamily: 'exo-regular',
  },
  text: {
    fontSize: 32,
    color: Constants.tertiaryBgColor,
    marginVertical: 20,
  },
  button: {
    width: '75%',
    backgroundColor: Constants.primaryBgColor,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
    height: 50,
    borderRadius: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: Constants.tertiaryBgColor,
    fontSize: 24,
    fontFamily: 'exo-regular',
  },
  resultContainer: {
    height: Dimensions.get('window').height * .2,
    backgroundColor: Constants.primaryHeaderColor,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
    marginTop: 20,
    width: Dimensions.get('window').width * .9,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  resultText: {
    color: Constants.tertiaryBgColor,
    fontSize: 24,
    fontFamily: 'exo-regular',
  },
  sendReqBtn: {
    fontSize: 20,
    backgroundColor: Constants.primaryBgColor,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
    borderRadius: 6,
    width: '50%',
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendReqBtnText: {
    fontSize: 20,
    color: Constants.tertiaryBgColor,
    fontFamily: 'exo-regular',
  },
})

