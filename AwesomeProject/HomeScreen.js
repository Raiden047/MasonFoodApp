import React, {Component, PureComponent} from 'react';
import { StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';

import StatusOSbar from './components/statusBar'
//import ResturantSlider from './components/resturantSlider'
import SearchBar from './components/searchBar'
import CustomText from './components/customText'
import FoodList from './components/foodList'
import {scale} from './components/scaling'

//import Images from './components/images'

class HomeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      first_name: "",
      last_name: "",
      photoUrl: ""
    };
  }

  componentWillMount = () => {
    this.getUserData();
  }

  getUserData = () => {
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref(`users/${uid}/`).once('value', snapshot => {
      this.setState({ first_name: snapshot.val().first_name});
      this.setState({ photoUrl: snapshot.val().profile_picture});
      this.props.screenProps.updateState(
        snapshot.val().first_name, 
        snapshot.val().last_name,
        snapshot.val().gmail,
        snapshot.val().profile_picture
      );
    });
    
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
                source={{uri: this.state.photoUrl}}
                />
            </TouchableOpacity>
            
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <CustomText fontFamily='Raleway' fontWeight='Bold' style={styles.greet}>
                Feeling Hungry {this.state.first_name}?
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
