import React, {Component} from 'react';
import { StyleSheet, View, Image, TouchableOpacity, FlatList, AsyncStorage} from 'react-native';

import { scale } from './scaling'
import Places from '../data/places'

//const userData = require('./data/user_info.json');
//const placesData = require('../data/places.json');

class ResturantSlider extends Component {
  changePlace = (item) => {
    var data = AsyncStorage.setItem('placeData', JSON.stringify(item.data), () => {
      //console.log(item.name);
    });
  }

  renderRow = ({ item }) => {  
    return (
      <TouchableOpacity onPress={() => this.changePlace(item)}>
        <View style={styles.container}>
          <Image 
            style={styles.logo}
            source={{uri: item.logo}}
          />
        </View>  
      </TouchableOpacity>
    )
  }
  
  render() {
    return (

        <View style={{width: "100%", height: scale(85)}}>
            <FlatList
                horizontal
                pagingEnabled={false}
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: scale(20), marginTop: scale(24)}}
                data={Places}
                renderItem={this.renderRow}
                keyExtractor={(item) => item.name}
            />
        </View>
    );
  }
}

export default ResturantSlider;


const styles = StyleSheet.create({
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

  /*
const places = [
  {
    name: 'Blaze Pizza',
    logo: 'https://www.pngfind.com/pngs/m/370-3703671_blaze-pizza-logo-tans-blaze-pizza-logo-png.png'
  },
  {
    name: 'Panda Express',
    logo: 'http://www.uwyo.edu/reslife-dining/_files/re-design-images/dining-logos/pandalogo_2016.png'
  },
  {
    name: 'Einstein Bros. Bagels',
    logo: 'http://www.uwyo.edu/reslife-dining/_files/re-design-images/dining-logos/einsteinslogo.png'
  },
  {
    name: 'Chick-fil-A',
    logo: 'https://i.ya-webdesign.com/images/chickfila-logo-png-19.png'
  },
  {
    name: 'Steak n Shake',
    logo: 'https://adc3ef35f321fe6e725a-fb8aac3b3bf42afe824f73b606f0aa4c.ssl.cf1.rackcdn.com/tenantlogos/13231.png'
  },
  {
    name: 'Dunkin’ Donuts',
    logo: 'https://s.pngix.com/pngfile/s/107-1074835_fisher-group-logos-de-dunkin-donuts-hd-png.png'
  },
  {
    name: 'Chipotle',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Chipotle_Mexican_Grill_logo.svg/1200px-Chipotle_Mexican_Grill_logo.svg.png'
  },
];*/