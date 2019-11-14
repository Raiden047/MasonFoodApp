import React, {Component, PureComponent} from 'react';
import { StyleSheet, View, Image, TouchableOpacity} from 'react-native';

import StatusOSbar from './components/statusBar'
//import ResturantSlider from './components/resturantSlider'
import SearchBar from './components/searchBar'
import CustomText from './components/customText'
import FoodList from './components/foodList'
import {scale} from './components/scaling'

import Images from './components/images'

const userData = require('./data/user_info.json');

class HomeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userData: userData
    };
  }
  
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusOSbar />
        <View style={styles.container}>
          <View style={styles.top}>
            <TouchableOpacity 
              onPress={() => this.props.navigation.openDrawer()}>
                <Image 
                style={styles.profileIcon}
                source={Images.profile_image}
                />
            </TouchableOpacity>
            
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <CustomText fontFamily='Raleway' fontWeight='Bold' style={styles.greet}>
                Feeling Hungry {this.state.userData.first_name}?
              </CustomText>
            </View>
            
          </View>

          <View style={{marginTop: scale(24), justifyContent: 'center', alignItems: 'center'}}>
            <SearchBar />
          </View>
       
          <FoodList navigation={this.props.navigation} />
            
        </View>
      </View>
    );
  }
}

export default HomeScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FDFF',
    flexDirection: "column",
  },
  top: {
    width: scale(350),
    height: scale(50),
    marginTop: scale(15),
    marginLeft: scale(24),
    flexDirection: "row"
  },
  profileIcon: {
    width: scale(50),
    height: scale(50),
    borderRadius: 50,
  },
  greet: {
    marginLeft: scale(15),
    fontSize: scale(25)
  },
});
