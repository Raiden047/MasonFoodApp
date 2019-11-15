//need to npm install react-naviation drawer and react naviagtion
import React, {Component} from 'react';
import { StyleSheet, Image, View, Text, YellowBox } from 'react-native';
import {Icon} from 'react-native-elements';
import { createDrawerNavigator, DrawerNavigatorItems} from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';
import ApiKeys from './constants/ApiKeys'

import SignInScreen from './SignInScreen'
import HomeScreen from './HomeScreen'
import DishInfoScreen from './DishInfoScreen'
import StatusOSbar from './components/statusBar'
import CustomText from './components/customText'
import {scale} from './components/scaling'
//import {StatusOSbar, CustomText, scale, Images} from './components'
//import Images from './components/images'

//const userData = require('./data/user_info.json');

import _ from 'lodash';
import { TouchableOpacity } from 'react-native-gesture-handler';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};


class App extends Component {  
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      authenticated: false,
      signedIn: false,
      name: "",
      first_name: "fahad",
      last_name: "",
			photoUrl: "",
			email: ''
    }

    if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig); }
	}

	componentDidMount = () => {
	}

	updateState = (first_name, last_name, email, photoUrl) => {
		this.setState({
			first_name: first_name,
			last_name: last_name,
			email: email,
			photoUrl: photoUrl
    })
	}
  
  render(){
    return (
      <MyApp 
        screenProps={{
          first_name:this.state.first_name, 
          last_name: this.state.last_name, 
					photoUrl: this.state.photoUrl,
					email: this.state.email,
					updateState: this.updateState
				}}
      />
    )
  }
  /*
  render() {
    //if (this.state.loading) return null;
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


const SlidePanel = (props) => {
	//state = userData;

  return(
    <View style={styles.drawerPanel}>
      
      <StatusOSbar />

      <View style={styles.container}>
        <View style={styles.profileInfo}>
          <Image 
            style={styles.profileIcon}
            source={{uri: props.screenProps.photoUrl}}
          />
          <View style={styles.profileText}>
            <CustomText fontFamily='Raleway' fontWeight='Bold' style={styles.text1}>
              {props.screenProps.first_name} {props.screenProps.last_name}
            </CustomText>
            <CustomText fontFamily='Roboto' fontWeight='Bold' style={styles.text2}>{props.screenProps.email}</CustomText>
          </View>
        </View>
        <View style={{marginLeft: 0, marginTop: 10}}>
          <DrawerNavigatorItems {...props} />
        </View>
				<View style={{marginTop: scale(400)}}>
					<TouchableOpacity 
						style={{marginBottom: scale(40)}}
						onPress={() => 
						{firebase.auth().signOut().then(console.log(firebase.auth().currentUser.uid))}}
					>
						<Icon 
							type='feather'
							name='log-out'
							color='#0287D1'
							size={30}
						/>
					</TouchableOpacity>
        
        	<Text style={styles.build}>Build: v0.1.12</Text>
				</View>
      </View>
    </View>
  );
};

const MyStackNavigator = createStackNavigator(
  {
    SignIn : { 
      screen: SignInScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      }
    },
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
    initialRouteName: 'SignIn',
    headerMode: 'none'
  }
);

const MyDrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: MyStackNavigator },
    /*
    Favorites: { screen: MyStackNavigator },
    Reviews: { screen: MyStackNavigator },
    Setting: { screen: MyStackNavigator },
    Logout: { screen: MyStackNavigator }*/
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
		},
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
