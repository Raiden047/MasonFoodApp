import React, {Component} from 'react';
import {View, Platform, StatusBar} from 'react-native';

class Status extends Component {
   
    render() {
      return (
          <View style={{height: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight, backgroundColor: 'black'}}></View>
      );
    }
  }
  
export default Status;