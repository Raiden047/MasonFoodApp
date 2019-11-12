import React, {Component, PureComponent} from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import { Icon } from 'react-native-elements';

import {scale} from './scaling'
import CustomText from './customText'
import { TouchableOpacity } from 'react-native-gesture-handler';

class Review extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            votes: 0,
            upVoted: false,
            downVoted: false
        };
    }

    upVote = () => {
        if(!this.state.upVoted) {
            this.state.downVoted === true ? this.setState({ votes: this.state.votes + 2 }) : this.setState({ votes: this.state.votes + 1 });
            this.setState({ upVoted: true });
            this.setState({ downVoted: false });
        }
        else{
            this.setState({ votes: this.state.votes - 1 });
            this.setState({ upVoted: false });
        }
    }

    downVote = () => {
        if(!this.state.downVoted) {
            this.state.upVoted === true ? this.setState({ votes: this.state.votes - 2 }) : this.setState({ votes: this.state.votes - 1 });
            this.setState({ downVoted: true });
            this.setState({ upVoted: false });
        }
        else{
            this.setState({ votes: this.state.votes + 1 });
            this.setState({ downVoted: false });
        }
    }

    componentDidMount(){
        this.setState({votes: this.props.votes});
    }

    setName = (name) => {
        return name;
    }

    setImage = (image) => {
        return image;
    }

    setRating = (rating) => {
        return rating;
    }

    setText = (text) => {
        return text;
    }
    
    render() {
        const name = this.setName(this.props.name);
        const profileImage = this.setImage(this.props.image);
        const rating = this.setRating(this.props.rating);
        const text = this.setText(this.props.text);
        //const votes = this.setVotes(this.props.votes);
        //const allProps = Object.assign({}, this.props, { style: style });
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