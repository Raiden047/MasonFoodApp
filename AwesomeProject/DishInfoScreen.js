import React, {Component, Fragment, PureComponent} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import { AirbnbRating, Icon} from 'react-native-elements'
import * as firebase from 'firebase';

import BottomSheet from 'reanimated-bottom-sheet'
import {FlatList} from 'react-native-gesture-handler'

import {scale} from './components/scaling'
import CustomText from './components/customText'
import StatusOSbar from './components/statusBar'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Review from './components/review'
import ReviewInput from './components/reviewInput'

export default class DishInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state ={
      rating: 0,
      Max_Rating: 5,
      reviews: [],
      firstReview: true,
      isModalVisible: false,
      path: ''
    }
  }

  componentWillMount = () => {
    try{
      var reviews = [];
      var placeKey = this.props.navigation.getParam('placeKey');
      var dishKey = this.props.navigation.getParam('dishKey');
      var path = `places/${placeKey}/dishes/${dishKey}/reviews/`;
      this.setState({path: path});

      var uid = firebase.auth().currentUser.uid;
      this.setState({userId: uid});
      //console.log("p: " + placeKey + " d: " + dishKey);
      firebase.database().ref(path).orderByChild('votes').once('value', snapshot => {
        //console.log(snapshot.val());
        snapshot.forEach(data => {
          reviews.push({ 
            name: data.val().name, 
            profile_image: data.val().profile_image, 
            key: data.key,
            rating: data.val().rating,
            text: data.val().text,
            votes: data.val().votes
          });
          var key = data.key;
          if(key === uid){
            this.setState({rating: data.val().rating});
            this.setState({firstReview: false});
          }
        });
        reviews = reviews.reverse();
        this.setState({reviews: reviews});
      });
    }
    catch(error){
      console.log(error);
    }
  }

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  )

  renderContent = () => {
    //const dish = this.props.navigation.getParam('dishInfo');
    //var dishKey = this.props.navigation.getParam('dishKey');
    //console.log(dishKey);
    return (
      <View style={styles.panel}>
        <Fragment>
          <FlatList
            style={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}
            data={this.state.reviews}
            renderItem={this.renderItem}
            keyExtractor={item => item.key}
            initialNumToRender={2}
            maxToRenderPerBatch={1}
            ListEmptyComponent={this.listEmptyComponent}
            extraData={this.state.reviews}
          />
        </Fragment>
      </View>
    )
  }

  renderItem = ({ item }) => {
    //placeKey = this.props.navigation.getParam('placeKey');
    //dishKey = this.props.navigation.getParam('dishKey');
    path = `${this.state.path}${item.key}/`; 
    //console.log(path);
    return (
      <Review 
        name={item.name} 
        image={item.profile_image} 
        rating={item.rating} 
        text={item.text} 
        votes={item.votes}
        //placeKey={placeKey}
        //dishKey={dishKey}
        //reviewKey={item.key}
        path={path}
      >
      </Review>
    )
  }

  listEmptyComponent = () => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{width: scale(156), height: scale(150)}}
              source={{uri: 'http://img.imgur.com/yBCpwMa.png'}} 
            />
        </View>
    )
  }

  discardReview = () => {
    var uid = this.state.userId;
    firebase.database().ref(`${this.state.path}/`).once('value', snapshot => {
      //console.log("firsTime rev: " + !snapshot.hasChild(`${this.state.userId}/`));
      if(snapshot.hasChild(`${this.state.userId}/`)){
        //console.log(snapshot.child(uid).child('rating').val());
        this.setState({rating: snapshot.child(uid).child('rating').val()});
      }
      else{
        this.setState({rating: 0});
      }
    });
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  upDateReviews = () => {
    var reviews = [];
    firebase.database().ref(this.state.path).orderByChild('votes').once('value', snapshot => {
      //console.log(snapshot.val());
      snapshot.forEach(data => {
        reviews.push({ 
          name: data.val().name, 
          profile_image: data.val().profile_image, 
          key: data.key,
          rating: data.val().rating,
          text: data.val().text,
          votes: data.val().votes
        });
      });
      reviews = reviews.reverse();
      this.setState({reviews: reviews});
    });
  }

  toggleModal = (data) => {
    this.setState({rating: data});
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
 
  render() {
    const dish = this.props.navigation.getParam('dishInfo');
    return(
      <View style={{flex: 1}}>
        <StatusOSbar />
        <View style={styles.MainContainer}>
          
          <View style={styles.imageView}>
            <View style={styles.backBtn}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon 
                  type='feather'
                  name='arrow-left'
                  color='#0287D1'
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <Image style={styles.imageContainer} source={{ uri: dish.pic }} />
          </View>

          <View style={styles.dishInfo}>
            <View style={{marginHorizontal: scale(24), marginTop: scale(12), flexDirection: "column"}}>
              <CustomText fontFamily="Raleway" fontWeight="Bold" style={{fontSize: scale(23)}}>{dish.name}</CustomText>
              <CustomText fontFamily="Roboto" fontWeight="Regular" style={{fontSize: scale(14), marginTop: scale(10)}}>{dish.discription}</CustomText>
              <View style={{width: "100%", height: scale(40), marginTop: scale(5), flexDirection: 'row', justifyContent:'space-between'}}>
                <View style={styles.price}>
                    <CustomText fontFamily="Roboto" fontWeight="Bold" style={{fontSize: scale(12), color: '#DEDEDE'}}>{dish.price}</CustomText>
                </View>
                <View style={styles.rate}>
                    <Image
                        style={{width: scale(40), height: scale(40)}}
                        source={require('./assets/ratingIcon.png')} 
                    />
                    <CustomText fontFamily="Roboto" fontWeight="Regular" style={{height: scale(40), fontSize: scale(28)}}>{dish.rating}</CustomText>
                </View>
              </View>
              <View 
                style={{marginTop: 30}} 
                onLayout={event => {this.state.BottomHeight = event.nativeEvent.layout.y;} }>
                <AirbnbRating 
                  count={this.state.Max_Rating}
                  ratingCount={this.state.rating}
                  showRating={false}
                  defaultRating={this.state.rating}
                  size={50}
                  onFinishRating={this.toggleModal}
                />
              </View>
            </View>
          </View>

        </View>
        
        <BottomSheet
          initialSnap={2}
          snapPoints={[scale(495), scale(280), scale(180)]}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
        />

        <ReviewInput 
          showModal={this.state.isModalVisible} 
          toggleModal={this.toggleModal} 
          path={this.state.path}
          rating={this.state.rating}
          discard={this.discardReview}
          refreash={this.upDateReviews}
        />

        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    height: "100%",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    width: '100%',
    height: '33%',
    position: 'relative',
  },
  backBtn: { 
    backgroundColor: "white", 
    borderRadius: 50, 
    width: scale(40), 
    height: scale(40), 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'absolute',
    marginLeft: scale(20),
    marginTop: scale(20), 
    zIndex: 100,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  dishInfo: {
    flex: 1,
    width: '100%',
    top: -50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'rgba(230, 232, 255, 1)'
  },
  price: {
    width: scale(91), 
    height: scale(25), 
    backgroundColor: "#333333", 
    borderRadius: 50, 
    justifyContent: "center", 
    alignItems: "center",
    position: 'absolute',
    left: 0,
    bottom: 0
  },
  rate: {
    width: scale(60), 
    height: "100%", 
    flexDirection: 'row',
    marginRight: scale(24),
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  panel: { 
    height: scale(475),
    backgroundColor:'#d6d3e3',
  },
  header: {
    height: scale(50),
    backgroundColor: '#d6d3e3',
    shadowColor: '#000000',
    paddingTop: scale(20),
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: scale(40),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#00000040',
    marginBottom: scale(10),
  },
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
