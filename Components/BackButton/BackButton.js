import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions, StatusBar } from 'react-native';
const backIcon = require('../../assets/back-arrow-white.png');

const BackButton = ({ close }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={close}>
      <Image style={styles.image} source={backIcon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    position: 'absolute',
    zIndex: 10,
    left: 10,
    top: Dimensions.get('window').height * .05,
    marginTop: -20,
  },
  image: {
    width: 40,
    height: 40,    
  }
});


export default BackButton;
