//need to npm install react-naviation drawer and react naviagtion
import React, {Component} from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { createDrawerNavigator, DrawerNavigatorItems} from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import HomeScreen from './HomeScreen'
import DishInfoScreen from './DishInfoScreen'
import StatusOSbar from './components/statusBar'
import CustomText from './components/customText'
import {scale} from './components/scaling'

import Images from './components/images'

const userData = require('./data/user_info.json');

class App extends Component {  

  render() {
    return (

      <MyApp />
    );
  }
}

export default App;

const SlidePanel = props => {
  state = userData;

  return(
    <View style={styles.drawerPanel}>
      
      <StatusOSbar />

      <View style={styles.container}>
        <View style={styles.profileInfo}>
          <Image 
            style={styles.profileIcon}
            source={Images.profile_image}
          />
          <View style={styles.profileText}>
            <CustomText fontFamily='Raleway' fontWeight='Bold' style={styles.text1}>
              {state.first_name} {state.last_name}
            </CustomText>
            <CustomText fontFamily='Roboto' fontWeight='Bold' style={styles.text2}>{state.email}</CustomText>
          </View>
        </View>
        <View style={{flex: 1, marginLeft: 0, marginTop: 10}}>
          <DrawerNavigatorItems {...props} />
        </View>
        <Text style={styles.build}>Build: {state.buildNum}</Text>
      </View>
    </View>
  );
};

const MyStackNavigator = createStackNavigator(
  {
    Home : { 
      screen: HomeScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    DishInfo : {
      screen: DishInfoScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    }
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
);

const MyDrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: MyStackNavigator },
    Favorites: { screen: MyStackNavigator },
    Reviews: { screen: MyStackNavigator },
    Setting: { screen: MyStackNavigator },
    Logout: { screen: MyStackNavigator }
  },
  {
    initialRouteName: 'Home',
    drawerPosition: 'left',
    contentComponent: SlidePanel,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerBackgroundColor: 'transparent',
    contentOptions: {
      labelStyle: {
        paddingLeft: scale(15),
      },
    }
  }
);

const MyApp = createAppContainer(MyDrawerNavigator);

const styles = StyleSheet.create({
  drawerPanel: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(27, 97, 135, 1.0)',
    borderTopRightRadius: 25,
  },
  profileInfo: {
    //flex: 1,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center"
  },
  profileIcon: {
    width: scale(50),
    height: scale(50),
    marginLeft: scale(24),
    marginTop: scale(15),
    marginRight: scale(10),
    borderRadius: 50
  },
  profileText: {
    flex: 1,
    flexDirection: 'column',
    marginTop: scale(15)
  },
  text1: {
    fontSize: scale(20), 
  },
  text2: {
    fontSize: scale(12),
    //fontFamily: 'Roboto', 
    //fontWeight: "bold",
  },
  build: {
    justifyContent: 'center',
    marginBottom: scale(15),
    textAlign: 'center'
  }
});
