import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Modal, Clipboard, Dimensions } from 'react-native';
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
    friendRequests: null,
  };

  componentDidMount = async () => {
    const user = await firebase.auth().currentUser;
    const email = user.email;
    const friends = await this.getFriends(email);
    const friendRequests = await this.getFriendRequests(email);
    this.setState({ user, friends, friendRequests, loading: false });
  }

  getFriends = async (email) => {
    const friendsSnap = await firebase.firestore().collection('users').doc(email).collection('friends').get();
    const friends = await friendsSnap.docs.map((doc) => doc.id);
    return friends;
  }

  getFriendRequests = async (email) => {
    const friendRequestsSnap = await firebase.firestore().collection('users').doc(email).collection('friendRequests').get();
    if(friendRequestsSnap.docs.length) {
      const friendRequests = await friendRequestsSnap.docs.map((doc) => doc.data());
      return friendRequests;
    }
    return null;
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

  renderFriendRequests = () => {
    const { friendRequests } = this.state;
    if(friendRequests) {
      return friendRequests.map((request, i) => {
        return (
          <View style={styles.requestContainer} key={`${request.from}${i}`}>
            <Text style={styles.requestText}>{request.from}</Text>
            <TouchableOpacity style={styles.sendMsgBtnContainer} onPress={() => this.acceptRequest(request.from)}><Text style={styles.sendMsgBtnText}>Accept</Text></TouchableOpacity>
            <TouchableOpacity style={styles.sendMsgBtnContainer} onPress={() => this.declineRequest(request.from)}><Text style={styles.sendMsgBtnText}>Decline</Text></TouchableOpacity>
          </View>
        );
      });
    }
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
    await firebase.firestore().collection('users').doc(to).collection('friendRequests').doc(user.email).set(newRequest);
    await firebase.firestore().collection('users').doc(to).collection('friends').doc(user.email).set({ exists: true });
  }

  acceptRequest = async (email) => {
    try {
      await this.clearRequest(email);
      await this.addUserToFriendInbox(email);
      this.clearRequestLocally(email);
      this.addFriendLocally(email);
    } catch(error) { console.error({ error })}
  }

  addFriendLocally = (newFriend) => {
    const { friends } = this.state;
    const exists = friends.includes(newFriend);
    if(!exists) {
      friends.push(newFriend);
      this.setState({ friends });
    }
  }

  addUserToFriendInbox = async (email) => {
    try {
      const { user } = this.state;
      const newFriend = { exists: true };
      await firebase.firestore().collection('users').doc(email).collection('friends').doc(user.email).set(newFriend);
    } catch(error) {console.error({ error })}
  }

  removeFriendLocally = (friend) => {
    const { friends } = this.state;
    const index = friends.findIndex((curFriend) => friend);
    friends.splice(index, 1);
    this.setState({ friends });
  }
  
  declineRequest = async (email) => {
    try {
      await this.clearRequest(email);
      await this.deleteFriend(email);
      this.clearRequestLocally(email);
      this.removeFriendLocally(email);
    } catch(error) { console.error({ error })}
  }

  clearRequest = async (email) => {
    try {
      const { user } = this.state;
      const requestSnap = firebase.firestore().collection('users').doc(user.email).collection('friendRequests').doc(email).delete();
    } catch(error) { console.error({ error })}
  }

  deleteFriend = async (email) => {
    try {
      const { user } = this.state;
      const friend = await firebase.firestore().collection('users').doc(user.email).collection('friends').doc(email).delete();
    } catch(error) { console.error({ error })}
  }

  clearRequestLocally = (email) => {
    const { friendRequests } = this.state;
    if(friendRequests.length === 1) {
      this.setState({ friendRequests: null });
      return;
    }
    const requestIndex = friendRequests.findIndex((request) => request === email);
    friendRequests.splice(requestIndex, 1);
    this.setState({ friendRequests });
  }

  render() {
    const { loading, showAddFriend, friendRequests } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.friendsContainer}>
          <Text style={styles.text}> Friends </Text>
          <ScrollView style={{height: '100%'}}>
            {!loading && this.renderFriends()}
          </ScrollView>
        </View>
        { friendRequests !== null && (
          <View style={styles.requestsContainer}>
            <Text style={styles.text}>Friend Requests</Text>
            <ScrollView>
              {this.renderFriendRequests()}
            </ScrollView>
          </View>
        )}
        <TouchableOpacity style={styles.addFriendContainer} onPress={this.toggleShowAddFriend}>
          <Text style={styles.addFriendText}>
            Add Friend
          </Text>
        </TouchableOpacity>
        <Modal visible={showAddFriend} animationType="slide" onRequestClose={() => this.setState({ showAddFriend: false })}>
          <SearchFriends handleSendRequest={this.handleSendRequest} toggleShowAddFriend={this.toggleShowAddFriend} />
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.primaryBgColor,
  },
  text: {
    color: Constants.tertiaryBgColor,
    fontSize: 32,
    textAlign: 'center',
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
  friendsContainer: {
    maxHeight: '50%',
  },
  friendContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    height: 50,
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
  requestsContainer: {
    width: Dimensions.get('window').width,
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  requestContainer: {
    backgroundColor: Constants.primaryHeaderColor,
    width: Dimensions.get('window').width * .95,
    display: 'flex',
    flexDirection: 'row',
    height: 60,
    borderRadius: 6,
    marginTop: 10,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestText: {
    color: Constants.tertiaryBgColor,
    fontSize: 20,
  },  
})

