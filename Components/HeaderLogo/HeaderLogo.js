import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import * as Constants from '../../Constants/Constants';

export default class renderLogo extends Component {
  state = {
    loadingFont: true,
  };

  componentDidMount = async () => {
    await Font.loadAsync({
      'exo-regular': require('../../assets/fonts/Exo2-Regular.otf'),
    });
    this.setState({ loadingFont: false });
  }

  render() {
    const { loadingFont } = this.state;
    const { loading, loaded } = styles;
    return (
      <Text style={loadingFont ? loading : loaded}>Lightning Messenger</Text>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    color: Constants.tertiaryBgColor, 
    fontSize: 24,
  },
  loaded: {
    fontFamily: 'exo-regular', 
    color: Constants.tertiaryBgColor, 
    fontSize: 24,
  }
})
