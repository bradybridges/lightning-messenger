import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Clipboard,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native';
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
    showConfirmDeleteFriend: false,
    friendRequests: null,
    pendingRequests: null,
    selectedFriend: null,
  };

  componentDidMount = async () => {
    const user = await firebase.auth().currentUser;
    const email = user.email;
    const friends = await this.getFriends(email);
    const friendRequests = await this.getFriendRequests(email);
    const pendingRequests = await this.getPendingRequests(email);
    this.setState({ 
      user, 
      friends, 
      friendRequests, 
      pendingRequests, 
      loading: false 
    });
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

  getPendingRequests = async (email) => {
    const pendingRequestsSnap = await firebase.firestore().collection('users').doc(email).collection('pendingRequests').get();
    if(pendingRequestsSnap.docs.length) {
      const pendingRequests = await pendingRequestsSnap.docs.map((doc) => doc.id);
      return pendingRequests;
    }
    return null;
  }

  renderFriends = () => {
    const { friends } = this.state;
    
    return friends.map((friend, i) => {
      return (
        <TouchableWithoutFeedback style={styles.friendContainer} key={`${friend}${i}`} onLongPress={() => this.handleDeleteFriend(friend)}>
          <View style={styles.friendContainer}>
            <Text style={styles.friendText}>{friend}</Text>
            <TouchableOpacity 
              style={styles.sendMsgBtnContainer}
              onPress={() => this.copyText(friend)}
            >
              <Text style={styles.sendMsgBtnText}>
                Copy
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      );
    });
  }

  handleDeleteFriend = async (friend) => {
    this.setState({ selectedFriend: friend, showConfirmDeleteFriend: true });
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

  renderPendingRequests = () => {
    const { pendingRequests } = this.state;
    console.l
    if(pendingRequests) {
      return pendingRequests.map((req, i) => {
        return (
          <View style={styles.requestContainer} key={`${req}${i}`}>
            <Text style={styles.requestText}>{req}</Text>
            <Text style={styles.requestText}>Pending...</Text>
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
    const { user, pendingRequests } = this.state;
    const newRequest = { from: user.email };
    await firebase.firestore().collection('users').doc(to).collection('friendRequests').doc(user.email).set(newRequest);
    await firebase.firestore().collection('users').doc(to).collection('friends').doc(user.email).set({ exists: true });
    await firebase.firestore().collection('users').doc(user.email).collection('pendingRequests').doc(to).set({exists: true});
    if(pendingRequests !== null) {
      this.setState({ pendingRequests: [to, ...pendingRequests] });
    } else {
      this.setState({ pendingRequests: [to] });
    }
  }

  acceptRequest = async (email) => {
    try {
      await this.clearRequest(email);
      await this.syncCloudFriends(email);
      await this.removePendingRequest(email);
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

  removePendingRequest = async (email) => {
    try {
      const { user } = this.state;
      await firebase.firestore().collection('users').doc(email).collection('pendingRequests').doc(user.email).delete();
    } catch(error) {console.error({ error })}
  }

  syncCloudFriends = async (email) => {
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
      await this.removePendingRequest(email);
      this.clearRequestLocally(email);
      this.removeFriendLocally(email);
    } catch(error) { console.error({ error })}
  }

  clearRequest = async (email) => {
    try {
      const { user } = this.state;
      const requestSnap = await firebase.firestore().collection('users').doc(user.email).collection('friendRequests').doc(email).delete();
    } catch(error) { console.error({ error })}
  }

  deleteFriend = async (email) => {
    try {
      const { user, friends } = this.state;
      const friend = await firebase.firestore().collection('users').doc(user.email).collection('friends').doc(email).delete();
      const updatedFriends = friends.filter((friend) => friend !== email);
      this.setState({ friends: updatedFriends, selectedFriend: null, showConfirmDeleteFriend: false });
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
    const { loading, showAddFriend, friendRequests, pendingRequests, showConfirmDeleteFriend, selectedFriend, friends } = this.state;
    return (
      <View style={styles.container}>
        {(friends.length > 0 && !loading) && (
          <View style={styles.friendsContainer}>
            <Text style={styles.text}> Friends </Text>
            <ScrollView style={{height: '100%'}}>
              {!loading && this.renderFriends()}
            </ScrollView>
          </View>
        )}
        {(friends.length === 0 && !loading) && (
          <View style={styles.noFriendsContainer}>
            <Text style={styles.text}> Friends </Text>
            <Text style={styles.noFriendsText}>No Friends Yet :/</Text>
          </View>
        )}
        { (friendRequests !== null || pendingRequests !== null) && (
          <View style={styles.requestsContainer}>
            <Text style={styles.text}>Friend Requests</Text>
            <ScrollView>
              {friendRequests !== null && this.renderFriendRequests()}
              {pendingRequests !== null && this.renderPendingRequests()}
            </ScrollView>
          </View>
        )}
        <TouchableOpacity style={styles.addFriendContainer} onPress={this.toggleShowAddFriend}>
          <Text style={styles.addFriendText}>
            Add Friend
          </Text>
        </TouchableOpacity>
        <Modal visible={showAddFriend} animationType="slide" onRequestClose={() => this.setState({ showAddFriend: false })}>
          <SearchFriends handleSendRequest={this.handleSendRequest} toggleShowAddFriend={this.toggleShowAddFriend} friends={friends}/>
        </Modal>
        <Modal visible={showConfirmDeleteFriend} animationType="slide" onRequestClose={() => this.setState({ showConfirmDeleteFriend: false })}>
          <View style={styles.deleteFriendContainer}>
            <Text style={styles.text}>Are you sure you want to delete {selectedFriend}?</Text>
            <TouchableOpacity style={styles.button} onPress={() => this.deleteFriend(selectedFriend)}><Text style={styles.buttonText}>Yes</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button}onPress={() => this.setState({ showConfirmDeleteFriend: false })}><Text style={styles.buttonText}>No</Text></TouchableOpacity>
          </View>
        </Modal>
        <ActivityIndicator 
          animating={loading} 
          size="large" 
          color={Constants.tertiaryBgColor}
          style={{ position: 'absolute', top: '30%', right: '50%', zIndex: 5 }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.primaryBgColor,
  },
  deleteFriendContainer: {
    backgroundColor: Constants.primaryBgColor,
    flex: 1,
    padding: 20,
  },  
  text: {
    color: Constants.tertiaryBgColor,
    fontSize: 32,
    textAlign: 'center',
    fontFamily: 'exo-regular',
  },
  noFriendsContainer: {
    height: Dimensions.get('window').height * .3,
    display: 'flex',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  noFriendsText: {
    color: Constants.tertiaryBgColor,
    fontSize: 32,
    textAlign: 'center',
    fontFamily: 'exo-regular',
    marginTop: 40,
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
    fontFamily: 'exo-regular',
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
    fontFamily: 'exo-regular'
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
    fontFamily: 'exo-regular',
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
    fontFamily: 'exo-regular',
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

