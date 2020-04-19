import React, { Component } from 'react';
import {
  Text, View, Dimensions, StyleSheet, StatusBar,
} from 'react-native';

export default class Header extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Lightning Messenger</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.1,
    backgroundColor: 'black',
    marginTop: StatusBar.currentHeight,
  },
  header: {
    color: 'white',
  },
});
