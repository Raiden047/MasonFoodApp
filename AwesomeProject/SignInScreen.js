import React, {Component} from 'react';
import { StyleSheet, Image, View, Text, Button} from 'react-native';

import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';

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
              this.props.navigation.navigate('Home');
            } else {
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
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.header}>Sign In With Google</Text>
                <Button
                    title="Sign in with Google" 
                    onPress={() => this.signIn()}
                >
                </Button>
            </View>
        )
    }
}

export default SignInScreen;

const styles = StyleSheet.create({
    header: {
        fontSize: 25
    }
});