import React, {Component} from 'react';
import {StyleSheet, Text, View, Platform, Image, TouchableOpacity} from 'react-native';
import { Rating, AirbnbRating  } from 'react-native-elements'

import StatusOSbar from './components/statusBar'

export default class DishInfo extends Component {
  constructor() {
    super();
  }

  render() {
    return(
      <View style={styles.MainContainer}>
        <StatusOSbar />
        <AirbnbRating 
          reviews={["","","","",""]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
