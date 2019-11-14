import React, {Component, PureComponent} from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import { Icon } from 'react-native-elements';
import * as firebase from 'firebase';

import {scale} from './scaling'
import CustomText from './customText'
import { TouchableOpacity } from 'react-native-gesture-handler';

class Review extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            votes: 0,
            upVoted: false,
            downVoted: false,
            userId: '',
            path: '',
        };
    }

    upVote = () => {
        var votes = this.state.votes;
        var upVoted = this.state.upVoted;
        var downVoted = this.state.downVoted;
        if(!this.state.upVoted) {
            this.state.downVoted === true ? votes += 2 : votes += 1;
            upVoted = true;
            downVoted = false;
        }
        else{
            votes -= 1;
            upVoted = false;
        }
        
        this.updateVotes(votes, upVoted, downVoted);
        this.setState({votes: votes});
        this.setState({upVoted: upVoted});
        this.setState({downVoted: downVoted});
    }

    downVote = () => {
        var votes = this.state.votes;
        var upVoted = this.state.upVoted;
        var downVoted = this.state.downVoted;
        if(!this.state.downVoted) {
            this.state.upVoted === true ? votes -= 2 : votes -= 1;
            upVoted = false;
            downVoted = true;
        }
        else{
            votes += 1;
            downVoted = false;
        }

        this.updateVotes(votes, upVoted, downVoted);
        this.setState({votes: votes});
        this.setState({upVoted: upVoted});
        this.setState({downVoted: downVoted});
    }

    updateVotes = (votes, upVoted, downVoted) => {
        //console.log(this.state.userId);
        firebase.database().ref(this.state.path).update({
            votes: votes,
        });
        //console.log(this.state.upVoted);
        firebase.database().ref(`${this.state.path}/voters/${this.state.userId}/`).set({
            upVoted: upVoted,
            downVoted: downVoted,
        });
    }

    hasVoted = (path, uid) => {
        firebase.database().ref(`${path}/`).once('value', snapshot => {
            //console.log("firsTime func: " + snapshot.hasChild('voters/'));
            if(!snapshot.hasChild('voters/')){
                firebase.database().ref(`${this.state.path}/voters/${uid}/`).set({
                    upVoted: false,
                    downVoted: false,
                });
            }
            else{
                firebase.database().ref(`${path}/voters/${uid}/`).once('value', snapshot => {
                    this.setState({ upVoted: snapshot.val().upVoted});
                    this.setState({ downVoted: snapshot.val().downVoted});
                });
            }
        });
    }

    componentDidMount(){
        const path = `places/${this.props.placeKey}/dishes/${this.props.dishKey}/reviews/${this.props.reviewKey}/`;
        //console.log(path);
        this.setState({ path: path });
        firebase.database().ref(path).once('value', snapshot => {
            this.setState({votes: snapshot.val().votes});
        });
        var uid = firebase.auth().currentUser.uid;

        this.setState({userId: uid});
 
        this.hasVoted(path, uid);
    }
    
    render() {
        const name = this.props.name;
        const profileImage = this.props.image;
        const rating = this.props.rating;
        const text = this.props.text;
        return (
            <View style={{flexDirection: 'row', width: scale(390), marginVertical: 10}}>
                <Image 
                    style={{width: scale(40), height: scale(40), marginHorizontal: 12, borderRadius: 50}}
                    source={{uri: profileImage}}
                />
                <View style={{width: scale(310), flexDirection: 'column', backgroundColor: 'white', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, borderTopRightRadius: 15}}>
                    <View style={{flexDirection: 'row', marginHorizontal: 12, marginTop: 5, marginBottom: 10, justifyContent:'space-between'}}>
                        <Text style={{fontSize: scale(14), fontWeight: 'bold'}}>{name}</Text>
                        <View style={styles.rate}>
                            <Image
                                style={{width: scale(20), height: scale(20)}}
                                source={require('../assets/ratingIcon.png')} 
                            />
                            <CustomText fontFamily="Roboto" fontWeight="Regular" style={{height: scale(20), fontSize: scale(14)}}>{rating}</CustomText>
                        </View>
                    </View>
                    <Text style={{marginHorizontal: 12, marginBottom: 12, fontSize: scale(14)}}>{text}</Text>
                </View>
                <View style={{flexDirection: 'column', width: scale(25), marginLeft: 5}}>
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, marginTop: 5}}>
                        <TouchableOpacity onPress={() => this.upVote()}>
                            <Icon 
                                type='font-awesome'
                                name='chevron-up'
                                color={this.state.upVoted === true ? 'blue' : 'black'}
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>{this.state.votes}</Text>
                    </View>
                    <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, marginBottom: 5}}>
                        <TouchableOpacity onPress={() => this.downVote()}>
                            <Icon 
                                type='font-awesome'
                                name='chevron-down'
                                color={this.state.downVoted === true ? 'blue' : 'black'}
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
  }
  
export default Review;

const styles = StyleSheet.create({
    container: {

    },
    rate: {
        height: "100%", 
        flexDirection: 'row',
        position: 'absolute',
        right: 0,
    }
});