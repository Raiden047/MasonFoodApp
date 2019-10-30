import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import { SearchBar } from 'react-native-elements';

import { scale } from './scaling'

class Search extends Component {
    state = {
      search: '',
    };

    updateSearch = search => {
      this.setState({ search });
    };
    
    render() {
      return (
        <SearchBar 
            platform='android'
            placeholder='Search for dishes....'
            onChangeText={this.updateSearch}
            value={this.state.search}
            
            inputStyle={styles.input}
            containerStyle={styles.container}
            placeholderTextColor={'rgba(0, 0, 0, 0.45)'}
            />
      );
    }
  }
  
export default Search;

const styles = StyleSheet.create({
    input: { 
        fontSize: scale(14), 
    },
    container: {
        backgroundColor: 'rgba(196, 196, 196, 0.35)', 
        borderRadius: 10, 
        width: scale(365), 
        height: scale(40), 
        justifyContent: 'center', 
        alignItems: 'center'
    }
  });