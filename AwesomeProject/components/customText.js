import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';

class CustomText extends Component {
    constructor() {
        super();
        this.state = {
            fontLoaded: false
        };
    }

    async componentDidMount() {
        await Font.loadAsync({
            'Raleway-Black': require('../assets/fonts/Raleway-Black.ttf'),
            'Raleway-Bold': require('../assets/fonts/Raleway-Bold.ttf'),
            'Raleway-SemiBold': require('../assets/fonts/Raleway-SemiBold.ttf'),
            'Raleway-Medium': require('../assets/fonts/Raleway-Medium.ttf'),
            'Raleway-Regular': require('../assets/fonts/Raleway-Regular.ttf'),

            'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
            'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf')
        });

        this.setState({ fontLoaded: true });
    }

  setFont = fontFamily => {
    switch (fontFamily) {
      case 'Roboto':
        return 'Roboto';
      case 'Raleway':
        return 'Raleway';
      default:
        return 'Roboto';
    }
  }

  setWeight = fontWeight => {
    return fontWeight;
  }

  setFontType = type => {
    switch (type) {
      case 'black':
        return 'Raleway-Black';
      case 'bold':
        return 'Raleway-Bold';
      case 'semi-bold':
        return 'Raleway-SemiBold';
      case 'medium':
        return 'Raleway-Medium';
      case 'regular':
        return 'Raleway-Regular';
      default:
        return 'Raleway-Regular';
    }
  };

  render() {
    //const font = this.setFontType(this.props.type ? this.props.type : 'normal');
    const fontName = this.setFont(this.props.fontFamily);
    const fontWeight = this.setWeight(this.props.fontWeight);
    const style = [{ fontFamily: fontName+'-'+fontWeight }, this.props.style || {}];
    const allProps = Object.assign({}, this.props, { style: style });
      return(
        <View>
            {this.state.fontLoaded ? (
            <Text {...allProps}>{this.props.children}</Text>
            ) : (
            <ActivityIndicator size="large" />
            )}
        </View>
      );
  }
}
export default CustomText;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', 
    alignItems: 'center'
  }
});