//need to npm install react-naviation drawer and react naviagtion
import React, {Component} from 'react';
import { StyleSheet, Image, View, Text, Button } from 'react-native';
import { createDrawerNavigator, DrawerNavigatorItems} from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

//import * as GoogleSignIn from 'expo-google-sign-in';
//import * as Expo from 'expo';
import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';
import ApiKeys from './constants/ApiKeys'

import HomeScreen from './HomeScreen'
import DishInfoScreen from './DishInfoScreen'
import StatusOSbar from './components/statusBar'
import CustomText from './components/customText'
import {scale} from './components/scaling'
//import {StatusOSbar, CustomText, scale, Images} from './components'
import Images from './components/images'

const userData = require('./data/user_info.json');

class App extends Component {  
  constructor(props){
    super(props);
    this.state = {
      isLoadingComplete: false,
      signedIn: false,
      name: "",
      photoUrl: ""
    }

    if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig); }
  }

  signIn = async () => {
    try {
      const result = await Google.logInAsync({
        behavoir: 'system',
        androidClientId:
          "1009462507431-khpn1hiufi0e2ha34p2hc7u2goflgr8d.apps.googleusercontent.com",
        //iosClientId: YOUR_CLIENT_ID_HERE,  <-- if you use iOS
        scopes: ["profile", "email"]
      })

      if (result.type === "success") {
        this.setState({
          signedIn: true,
          name: result.user.name,
          photoUrl: result.user.photoUrl
        })
      } else {
        console.log("cancelled")
      }
    } catch (e) {
      console.log("error", e)
    }
  }

  render() {
    return (
      <View style={{flex:1}}>
        {this.state.signedIn ? (
          <MyApp name={this.state.name} photoUrl={this.state.photoUrl} />
        ) : (
          <LoginPage signIn={this.signIn} />
        )}
      </View>
    );
  }
}

export default App;

const LoginPage = props => {
  return (
    <View>
      <Text style={styles.header}>Sign In With Google</Text>
      <Button title="Sign in with Google" onPress={() => props.signIn()} />
    </View>
  )
}

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
  },
  header: {
    fontSize: 25
  }
});
