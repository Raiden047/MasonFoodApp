import React, {Component} from 'react';
import {StyleSheet, Text, View, Platform, Image, TouchableOpacity} from 'react-native';

export default class Rating extends Component {
  constructor() {
    super();
    this.state = {
      Default_Rating: 0,
      Max_Rating: 5,
    };
  }
  UpdateRating(key) {
    this.setState({Default_Rating: key});
  }
  render() {
    let React_Native_Rating_Bar = [];
    for (var i = 1; i <= this.state.Max_Rating; i++) {
      React_Native_Rating_Bar.push(
        <TouchableOpacity activeOpacity = {0.7} key={i} onPress={this.UpdateRating.bind(this, i)}>
            <Image
              style = {styles.StarImage}
              source={
                i <= this.state.Default_Rating
                  ? require('../assets/star-filled.png')
                  : require('../assets/star-unfilled.png')
              }
            />
          </TouchableOpacity>
      );
    }
    return(
      <View style={styles.MainContainer}>
        <Text style={styles.textStyle}>Please Rate the Dish</Text>
        <View style={styles.childView}>{React_Native_Rating_Bar}</View>
        <Text style={styles.textStyle}>
          {this.state.Default_Rating} / {this.state.Max_Rating}
        </Text>
        <TouchableOpacity
          activeOpacity = {0.7}
          style={styles.button}
          onPress={() => alert(this.state.Default_Rating)}>
            <Text>Get Selected Value</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },

  childView: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },

  button: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
    padding: 15,
    backgroundColor: '#ABCDEF',
  },

  StarImage: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 23,
    color: '#000',
    marginTop: 15,
  },
});
