import React, {Component} from 'react';
import {StyleSheet, Text, View, Platform, Image, TouchableOpacity} from 'react-native';
import { Rating, AirbnbRating  } from 'react-native-elements'

import StatusOSbar from './components/statusBar'

export default class DishInfo extends Component {
  constructor(props) {
    super(props);
  }

 
  render() {
    const dish = this.props.navigation.getParam('dishInfo');
    return(
      <View style={styles.MainContainer}>
        <StatusOSbar />
        <Text>{dish.name}</Text>
        <AirbnbRating 
          count={5}
          reviews={["","","","",""]} 
          defaultRating={0}
          size={50}
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
