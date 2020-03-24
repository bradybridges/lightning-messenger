import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DeleteConversationMenu = ({ deleteConversation, toggleDeleteConversationMenu }) => {
  return (
    <View style={styles.deleteConversationContainer}>
      <Text style={styles.text}>Delete Conversation?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={deleteConversation}>
          <Text>
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleDeleteConversationMenu}>
          <Text>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  deleteConversationContainer: {

  },
  text: {

  },
  button: {

  },
})


export default DeleteConversationMenu;

