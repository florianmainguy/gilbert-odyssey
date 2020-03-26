import React from 'react';
import _ from 'lodash'
import { Search, Label } from 'semantic-ui-react'

class SearchCyclist extends React.Component {
    constructor(props) {
        super(props);
        this.handleCyclist = this.handleCyclist.bind(this);
        this.cyclistSearch = [];
        this.initialState = this.state;
        this.state = {
            isLoading: false,
            results: [],
            value: ''
        };
    }

    handleCyclist(cyclistName) {
        this.props.handlerRightUI('cyclist', cyclistName);
    }

    resultRenderer = ({ title }) => <Label content={title}/>

    handleResultSelect = (e, { result }) => {
        this.setState({ value: '' })
        this.handleCyclist(result.title);
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })
    
        setTimeout(() => {
            if (this.state.value.length < 1) return this.setState(this.initialState)
        
            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = (result) => re.test(result.title)
        
            this.setState({
                isLoading: false,
                results: _.filter(this.cyclistSearch, isMatch),
            })
        }, 300)
    }

    componentDidMount() {
        this.cyclistSearch = this.props.cyclists.map( value => ({ "title": value.cyclist }));
    }

    render() {
        return (
            <Search
                minCharacters='3'
                input={{ iconPosition: 'left', placeholder: "Search..." }}
                loading={this.state.isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    leading: true,
                })}
                results={this.state.results}
                value={this.state.value}
                resultRenderer={this.resultRenderer}
            />
        )
    }
}

export default SearchCyclist;