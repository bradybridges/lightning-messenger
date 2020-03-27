import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Constants from '../../Constants/Constants';

export default class Friends extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> Friends </Text>
        <TouchableOpacity style={styles.addFriendContainer}>
          <Text style={styles.addFriendText}>
            Add Friend
          </Text>
        </TouchableOpacity>
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
})

