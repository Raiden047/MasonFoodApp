import React, {Component} from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Image } from 'react-native';

import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';

import {scale} from './components/scaling'
import CustomText from './components/customText'
import StatusOSBar from './components/statusBar'



class SignInScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            authenticated: false,
            signedIn: false,
            name: "",
            first_name: "",
            last_name: "",
            photoUrl: ""
        }
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(
          function(user) {
            console.log('AUTH STATE CHANGED CALLED ');
            if (user) {
                this.setState({ loading: false, authenticated: true });
                this.props.navigation.navigate('Home');
            } else {
                this.setState({ loading: false, authenticated: false });
                this.props.navigation.navigate('SignIn');
            }
          }.bind(this)
        );
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
        //old has for andriod key
        //B2:11:6A:61:F3:C7:8A:7A:3D:8E:42:BA:B4:78:BF:66:99:54:A4:93
        //old reserved client id
        //com.googleusercontent.apps.1009462507431-3russs08sidpkatlctqk99i1ee0eluo4
        const result = await Google.logInAsync({
        behavoir: 'web',
        androidClientId: "1009462507431-khpn1hiufi0e2ha34p2hc7u2goflgr8d.apps.googleusercontent.com",
        androidStandaloneAppClientId: "1009462507431-khpn1hiufi0e2ha34p2hc7u2goflgr8d.apps.googleusercontent.com",
        iosClientId: "1009462507431-kbi6pn012c9gue233a6npdeoikkhujfu.apps.googleusercontent.com",
        iosStandaloneAppClientId: "1009462507431-kbi6pn012c9gue233a6npdeoikkhujfu.apps.googleusercontent.com",
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
        if (this.state.loading) return null; // Render loading/splash screen etc
        else{
            return (
                <View style={{flex: 1}}>
                    <StatusOSBar />
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Image 
                            style={{position: 'absolute', resizeMode: 'stretch', zIndex: -100}}
                            source={require('./assets/splash_background.png')}
                        />
                        <Image 
                            style={{width: scale(180), height: scale(180), aspectRatio: 1/1, position: 'absolute', top: scale(120)}}
                            source={require('./assets/app_logo.png')}
                        />

                        <TouchableOpacity style={styles.googleButton} activeOpacity={0.8} onPress={() => this.signIn()}>
                            <View style={{height: scale(47), aspectRatio: 1/1, marginLeft: scale(0.5), borderRadius: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
                                <Image 
                                    source={require('./assets/google_logo.png')} 
                                    style={styles.googleIcon} 
                                />
                            </View>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <CustomText fontFamily={'Roboto'} fontWeight={'Medium'} style={styles.TextStyle}>Sign in with Google</CustomText>
                            </View>
                        </TouchableOpacity>
                    </View> 
                </View>

            )
        }   
    }
}

export default SignInScreen;

const styles = StyleSheet.create({
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4285F4',
        borderWidth: 1,
        borderColor: '#4285F4',
        width: scale(240),
        height: scale(50),
        borderRadius: 3,
        margin: scale(5),  
        elevation: 5,
    },
    googleIcon: {
        padding: scale(10),
        margin: scale(5),
        height: scale(25),
        width: scale(25),
        resizeMode: 'stretch',
    },
    TextStyle :{
        color: "white",
        fontSize: scale(16)
    }
});