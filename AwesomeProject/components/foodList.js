import React, {Component} from 'react';
import { StyleSheet, View, Image, TouchableOpacity, FlatList, AsyncStorage} from 'react-native';

import { scale } from './scaling' 
import CustomText from './customText'

const filter = ['Popular','Recent','Speed','Price'];
const list = filter.map((String) =>
    <TouchableOpacity style={{marginHorizontal: 20}} key={String}>
        <CustomText fontFamily='Roboto' fontWeight='Bold' style={{fontSize: scale(14)}}>{String}</CustomText>
    </TouchableOpacity>
);

const foodData = require('../data/blazePizzaDishes.json');
const numColumns = 2;

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
    }

    return data;
};

class FoodList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            list: {},
        }
    }

    componentDidMount() {
        var load = AsyncStorage.getItem('placeData').then(
            (place) => {
                //this.setState({ list: place});
                //console.log(place.data);
                this.updateFoodList(place)
                //return place.data;
            }    
        );
    }

    updateFoodList = (place) => {
        this.setState({ list: place});
        console.log(this.state.list)
        
    }
    
    renderRow = ({ item }) => {
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.props.navigation.navigate('DishInfo',{ dishInfo: item })}>
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

    render() {
        return (
            <View style={styles.bottom}>
                <View style={styles.filter}>{list}</View>
                <FlatList
                    vertical
                    pagingEnabled={false}
                    showsVerticalScrollIndicator={false}
                    style={{marginHorizontal: scale(25), marginTop: scale(10)}}
                    data={formatData(foodData.dishes, numColumns)}
                    renderItem={this.renderRow}
                    keyExtractor={(item) => item.name}
                    numColumns={numColumns}
                    //extraData={this.updateFoodList()}
                />
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