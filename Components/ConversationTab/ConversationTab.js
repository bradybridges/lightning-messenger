import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const ConversationTab = ({from, time, updateSelectedConversation}) => {
  return (
    <TouchableOpacity onPress={() => updateSelectedConversation(from)}>
      <Text>{from}</Text>
      <Text>{time}</Text>
    </TouchableOpacity>
  );
}

export default ConversationTab
