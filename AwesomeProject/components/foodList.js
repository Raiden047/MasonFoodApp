import React, {Component, PureComponent} from 'react';
import { StyleSheet, View, Image, TouchableOpacity, FlatList} from 'react-native';
import * as firebase from 'firebase';

import { scale } from './scaling' 
import CustomText from './customText'

const filter = ['Popular','Recent','Speed','Price'];
const listF = filter.map((String) =>
    <TouchableOpacity style={{marginHorizontal: 20}} key={String}>
        <CustomText fontFamily='Roboto' fontWeight='Bold' style={{fontSize: scale(14)}}>{String}</CustomText>
    </TouchableOpacity>
);

const numColumns = 2;

class FoodList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            list: [],
            places: [],
            placeKey: 0,
            dishKey: -1,
        }
    }

    componentWillMount = () => {
        try {
            const places = [];
            firebase.database().ref("/places/").once('value', snapshot => {
                snapshot.forEach(data => {
                    places.push({ name: data.val().name, logo: data.val().logo, key: data.key });
                });
                //console.log(places);
                this.setState({places: places});
            });
            this.changePlace(0);
        }
        catch (error) {
            console.log(error);
        }
    }

    nav = (item) => {
        this.props.navigation.navigate('DishInfo',{ dishInfo: item, placeKey: this.state.placeKey, dishKey: item.key });
    }

    renderRow = ({ item }) => {
        //this.setState({dishKey: item.key});
        return (
            <TouchableOpacity 
                style={styles.container} 
                onPress={() => this.nav(item)}>
                <View style={styles.innerContainer}>
                    <Image 
                        style={{width: '100%', height: scale(120), borderRadius: 20}}
                        source={{uri: item.pic}}
                    />
                    <CustomText fontFamily='Roboto' fontWeight='Regular' style={styles.title}>{item.name}</CustomText>
                    <View style={{width: "100%", height: scale(25)}}>
                        <View style={styles.price}>
                            <CustomText fontFamily="Roboto" fontWeight="Bold" style={{fontSize: scale(10), color: '#DEDEDE'}}>{item.price}</CustomText>
                        </View>
                        <View style={styles.rate}>
                            <Image
                                style={{width: scale(25), height: scale(25)}}
                                source={require('../assets/ratingIcon.png')} 
                            />
                            <CustomText fontFamily="Roboto" fontWeight="Regular" style={{height: scale(25), fontSize: scale(18)}}>{item.rating}</CustomText>
                        </View>
                    </View>
                </View> 
            </TouchableOpacity>
        )
    }

    changePlace = (key) => {
        firebase.database().ref(`places/${key}/`).once('value', snapshot => {
            const foods = [];
            //console.log(snapshot.child('dishes/').key);
            snapshot.child('dishes/').forEach(data => {
                foods.push({ 
                    name: data.val().name, 
                    pic: data.val().pic, 
                    key: data.key, 
                    discription: data.val().discription,
                    price: data.val().price,
                    rating: data.val().rating
                });
            });
            this.setState({list: foods});
            this.setState({placeKey: key});
        });
        //console.log("pkey:" + this.state.placeKey);
    }

    renderRowSlider = ({ item }) => {  
      return (
        <TouchableOpacity onPress={() => this.changePlace(item.key)}>
          <View style={sliderStyles.container}>
            <Image 
              style={sliderStyles.logo}
              source={{uri: item.logo}}
            />
          </View>  
        </TouchableOpacity>
      )
    }

    render() {
        return (
            <View style={{flex: 1}}>
                
                <View style={{width: "100%", height: scale(85)}}>
                    <FlatList
                        horizontal
                        pagingEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        style={{ marginHorizontal: scale(20), marginTop: scale(24)}}
                        data={this.state.places}
                        renderItem={this.renderRowSlider}
                        keyExtractor={(item) => item.key}
                    />
                </View>

                <View style={styles.bottom}>
                <View style={styles.filter}>{listF}</View>
                <FlatList
                    vertical
                    pagingEnabled={false}
                    showsVerticalScrollIndicator={false}
                    style={{marginHorizontal: scale(25), marginTop: scale(10)}}
                    data={this.state.list}
                    renderItem={this.renderRow}
                    keyExtractor={(item) => item.key}
                    numColumns={numColumns}
                    extraData={this.state.list}
                    removeClippedSubviews={true}
                    initialNumToRender={4}
                    updateCellsBatchingPeriod={10}
                />
                </View>
            </View>
        );
    }
  }
  
export default FoodList;

const styles = StyleSheet.create({
    container: {
        marginRight: scale(40), 
        marginTop: scale(15), 
        marginBottom: scale(35) 
    },
    innerContainer: {
        width: scale(160), 
        flexDirection:'column', 
        justifyContent: "center", 
        alignItems: "center"
    },
    bottom: {
        flex: 1,
        marginTop: scale(24),
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        backgroundColor: 'rgba(196, 196, 196, 0.35)', 
    },
    filter: {
        flexDirection: 'row', 
        marginTop: scale(20), 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    title: { 
        fontSize: scale(20), 
        marginTop: 8, 
        color: "#133C52"
    },
    price: {
        width: scale(80), 
        height: scale(20), 
        backgroundColor: "#333333", 
        borderRadius: 50, 
        justifyContent: "center", 
        alignItems: "center", 
        position: 'absolute', 
        bottom: 0, 
        left: 0
    },
    rate: {
        width: scale(60), 
        height: "100%", 
        flexDirection: 'row', 
        position: 'absolute', 
        bottom: 0, 
        right: 0
    }
});

const sliderStyles = StyleSheet.create({
    container: {
        width: scale(60), 
        height: scale(60), 
        borderRadius: 15, 
        backgroundColor: "grey", 
        marginRight: scale(15), 
    },
    logo: {
        width: "100%", 
        height: "100%", 
        borderRadius: 15
    }
  });