import React from 'react';
import { StyleSheet, View} from 'react-native';
import { Button,TextInput } from 'react-native-paper';
import Modal from "react-native-modal";
import * as firebase from 'firebase';

import {scale} from './scaling'

export default class ReviewInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 0,
            text: '',
            path: '',
            userId: '',
            name: '',
            photoUrl: '',
        }
    }

    componentDidMount = () => {
        this.setState({path: this.props.path});
        this.setState({rating: this.props.rating});
        

        var uid = firebase.auth().currentUser.uid;
        this.setState({userId: uid});

        firebase.database().ref(`users/${uid}/`).once('value', snapshot => {
            this.setState({ name: snapshot.val().first_name + " " + snapshot.val().last_name});
            this.setState({ photoUrl: snapshot.val().profile_picture});
        });
    }

    toggleModal(){
        this.props.discard();
    }

    submitReview = () => {
        console.log("rating:"+this.props.rating);
        console.log(this.state.userId);
        console.log(`${this.state.path}${this.state.userId}/`);
        firebase.database().ref(`${this.state.path}${this.state.userId}/`).set({
            name: this.state.name,
            profile_image: this.state.photoUrl,
            rating: this.props.rating,
            text: this.state.text,
            votes: 0,
        });

        this.props.refreash();

        this.props.toggleModal(this.props.rating);
    }

    discardReview = () => {
        this.setState({text: ''});
        this.props.discard();
    }

    render() {
        return (
            <View>
            <Modal 
                isVisible={this.props.showModal}
                avoidKeyboard={false}
                deviceHeight={8000}
                animationOutTiming={600}
                backdropTransitionOutTiming={1000}
                onBackdropPress={() =>  this.toggleModal()}
                onBackButtonPress={() => this.toggleModal()}
                >
                <TextInput
                    label='How was the dish?'
                    multiline
                    numberOfLines={4}
                    maxLength={125}
                    value={this.state.text}
                    onChangeText={text => this.setState({ text })}
                    underlineColor={'#4285F4'}
                />
                <View style={styles.content}>
                    <View style={{flexDirection: 'row'}}>  
                    <Button onPress={() => this.discardReview()} style={{marginRight: scale(100)}}>Discard</Button>
                    <Button onPress={() => this.submitReview()} style={{marginleft: scale(100)}}>Submit</Button>
                    </View>
                </View>
            </Modal>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    content: {
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      }
});