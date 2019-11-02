import React, {Component, createContext} from 'react';

export const ResturantContext = createContext({});


class ResturantContextProvider extends Component {
    state = {
        list: require('../data/blazePizzaDishes.json').dishes,
    };

    changeResturant = (item) => {
        this.setState({
          list: item
        })
        //console.log(this.state.list);
        const usersDataDictionary = keyBy(item, 'name');
        console.log(usersDataDictionary);
    }

    render() {
        return(
            <ResturantContext.Provider value={{...this.state, changeResturant: this.changeResturant, getList: this.getList}}>
                {this.props.children}
            </ResturantContext.Provider> 
        )
    }
}

export default ResturantContextProvider;