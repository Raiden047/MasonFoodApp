import React, {Component, createContext} from 'react';

export const ResturantContext = createContext({
    list: '',
    updateList: () => {},
});


class ResturantContextProvider extends Component {
    state = {
        list: require('../data/blazePizzaDishes.json'),
    };

    changeResturant = (item) => {
        this.setState({
          list: item
        })
        //console.log(this.state.list);
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

export const ResturantContextConsumer = ResturantContext.Consumer;