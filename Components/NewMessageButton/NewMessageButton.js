import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Constants from '../../Constants/Constants';

const NewMessageButton = ({ toggleNewConversation }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => toggleNewConversation()}>
      <Text style={styles.text}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.secondaryBgColor,
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderColor: 'white',
    borderWidth: 1,
  },
  text: {
    fontSize: 52,
    color: 'white',
  },
});


export default NewMessageButton
