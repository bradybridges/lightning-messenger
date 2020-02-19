import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as Constants from '../../Constants/Constants';
const addIcon = require('../../assets/add-icon.png');

const NewMessageButton = ({ toggleNewConversation }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => toggleNewConversation()}>
      <Image source={addIcon} style={styles.image}/>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 65,
    height: 65,
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  image: {
    width: 65, 
    height: 65,
  },
});


export default NewMessageButton
