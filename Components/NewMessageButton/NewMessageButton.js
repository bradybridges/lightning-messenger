import React from 'react';
import { Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as Constants from '../../Constants/Constants';
const add = require('../../assets/add.png');

const NewMessageButton = ({ toggleNewConversation }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => toggleNewConversation()}>
       <Image source={add} style={styles.image} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: Constants.primaryHeaderColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
  },
  image: {
    width: 35, 
    height: 35,
  },
});


export default NewMessageButton
