import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Modal, Clipboard } from 'react-native';
import SearchFriends from '../../Components/SearchFriends/SearchFriends';
import * as Constants from '../../Constants/Constants';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

export default class Friends extends Component {

  state = {
    friends: [],
    user: null,
    loading: true,
    showAddFriend: false,
  };

  componentDidMount = async () => {
    const user = await firebase.auth().currentUser;
    const email = user.email;
    const friends = await this.getFriends(email);
    this.setState({ user, friends, loading: false });
  }

  getFriends = async (email) => {
    const friendsSnap = await firebase.firestore().collection('users').doc(email).collection('friends').get();
    const friends = await friendsSnap.docs.map((doc) => doc.id);
    return friends;
  }

  renderFriends = () => {
    const { friends } = this.state;
    
    return friends.map((friend, i) => {
      return (
        <View style={styles.friendContainer} key={`${friend}${i}`}>
          <Text style={styles.friendText}>{friend}</Text>
          <TouchableOpacity style={styles.sendMsgBtnContainer}>
            <Text style={styles.sendMsgBtnText} onPress={() => this.copyText(friend)}>
              Copy
            </Text>
          </TouchableOpacity>
        </View>
      );
    });
  }

  toggleShowAddFriend = () => {
    const { showAddFriend } = this.state;
    this.setState({ showAddFriend: !showAddFriend });
  }

  copyText = async (value) => {
    await Clipboard.setString(value);
    alert('Copied Text');
  }

  handleSendRequest = async (to) => {
    const { user } = this.state;
    const newRequest = { from: user.email };
    //encrypt newRequest
    await firebase.firestore().collection('users').doc(to).collection('friendRequests').add(newRequest);
  }

  render() {
    const { loading, showAddFriend } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.text}> Friends </Text>
          <ScrollView>
            {!loading && this.renderFriends()}
          </ScrollView>
        <TouchableOpacity style={styles.addFriendContainer} onPress={this.toggleShowAddFriend}>
          <Text style={styles.addFriendText}>
            Add Friend
          </Text>
        </TouchableOpacity>
        <Modal visible={showAddFriend} animationType="slide" onRequestClose={() => this.setState({ showAddFriend: false })}>
          <SearchFriends handleSendRequest={this.handleSendRequest}/>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.primaryBgColor,
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    color: Constants.tertiaryBgColor,
    fontSize: 32,
  },
  addFriendContainer: {
    width: 150,
    backgroundColor: Constants.primaryHeaderColor,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
    position: 'absolute',
    bottom: 20,
    right: 10,
  },
  addFriendText: {
    color: Constants.tertiaryBgColor,
    fontSize: 20,
  },
  friendContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  friendText: {
    color: 'white',
    fontSize: 20,
    marginLeft: 40,
  },
  sendMsgBtnContainer: {
    marginRight: 10,
    borderRadius: 6,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
    backgroundColor: Constants.primaryHeaderColor,
    width: '25%',
    height: 30,
  },
  sendMsgBtnText: {
    color: Constants.tertiaryBgColor,
    fontSize: 16,
    textAlign: 'center',
  },
})

