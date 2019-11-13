//need to npm install react-naviation drawer and react naviagtion
import React, {Component} from 'react';
import { StyleSheet, Image, View, Text, Button } from 'react-native';
import { createDrawerNavigator, DrawerNavigatorItems} from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

//import * as GoogleSignIn from 'expo-google-sign-in';
//import * as Expo from 'expo';
import * as Google from 'expo-google-app-auth';
//import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin'
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
      first_name: "",
      last_name: "",
      photoUrl: ""
    }

    if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig); }
  }

  componentDidMount = () => {
    /*
    firebase.database().ref('user/').once('value', function (snapshot) {
      //console.log(snapshot.val());
    });*/
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.uid
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = (googleUser) => {
    //console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase.auth().signInWithCredential(credential).then(function(result) {
              console.log('user signed in ');
              if (result.additionalUserInfo.isNewUser) {
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .set({
                    gmail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    created_at: Date.now()
                  })
                  .then(function(snapshot) {
                    // console.log('Snapshot', snapshot);
                  });
              } else {
                firebase.database().ref('/users/' + result.user.uid).update({
                    last_logged_in: Date.now()
                  });
              }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        } else {
          console.log('User already signed-in Firebase.');
        }
      }.bind(this)
    );
  };

  signIn = async () => {
    try {
      const result = await Google.logInAsync({
        behavoir: 'system',
        androidClientId:
          "1009462507431-khpn1hiufi0e2ha34p2hc7u2goflgr8d.apps.googleusercontent.com",
        iosClientId: "1009462507431-kbi6pn012c9gue233a6npdeoikkhujfu.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      })

      if (result.type === "success") {
        this.setState({
          signedIn: true,
          name: result.user.name,
          first_name: result.user.givenName,
          last_name: result.user.familyName,
          photoUrl: result.user.photoUrl
        })
        this.onSignIn(result);
      } else {
        console.log("cancelled")
      }
    } catch (e) {
      console.log("error", e)
    }
  }
  
  render(){
    return (
      <MyApp />
    )
  }
  /*
  render() {
    return (
      <View style={{flex:1}}>
        {this.state.signedIn ? (
          <MyApp name={this.state.first_name} photoUrl={this.state.photoUrl} />
        ) : (
          <LoginPage signIn={this.signIn} />
        )}
      </View>
    );
  }*/
}

export default App;

const LoginPage = props => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={styles.header}>Sign In With Google</Text>
      <Button
        title="Sign in with Google" 
        onPress={() => props.signIn()}
        //size={GoogleSigninButton.Size.Wide}
        //color={GoogleSigninButton.Color.Dark}
        //disabled={this.state.isSigninInProgress}
      >
      </Button>
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
