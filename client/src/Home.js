import React from 'react';
import _ from 'lodash'
import { Search, Label } from 'semantic-ui-react'

class HomeCyclist extends React.Component {
    constructor(props) {
        super(props);
        this.cyclistSearch = [];
        this.state = {
            isLoading: false,
            results: [],
            value: ''
        };
        this.initialState = this.state;
    }

    resultRenderer = ({ title }) => <Label content={title} />

    handleResultSelect = (e, { result }) => this.setState({ value: result.title })

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
        //console.log(this.cyclistSearch);
    }

    render() {
        return (
            <div className="home-cyclist">
                <h6>Find a Cyclist:</h6>
                <form className="cyclist-search">
                    <input type="search" placeholder="Search Cyclist"/>
                    <Search
                        className= "semantic-search"
                        loading={this.state.isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={_.debounce(this.handleSearchChange, 500, {
                            leading: true,
                        })}
                        results={this.state.results}
                        value={this.state.value}
                        resultRenderer={this.resultRenderer}
                        {...this.props}
                    />
                </form>
            </div>
        )
    }
}
/*
<div fallbackElement="[object Object]" class="ui search">
    <div class="ui icon input">
        <input type="text" value="" tabindex="0" class="prompt" autocomplete="off" />
        <i aria-hidden="true" class="search icon"></i>
    </div>
        <div class="results transition">
        <div class="message empty"><div class="header">No results found.</div></div>
    </div>
</div>*/

class HomeClassique extends React.Component {
    constructor(props) {
        super(props);
        this.handleRace = this.handleRace.bind(this);
    }

    handleRace(raceName) {
        this.props.handlerRightUI('race', raceName);
    }

    render() {
        return (
            <div className="home-race">
                <h6>Pick a classic:</h6>
                <ul className="classique-list">
                    <a href="#" className="flex-races-a" onClick={() => this.handleRace('Milano-Sanremo')}>
                        <li className="flex-races"><h5 className="race-title">Milano-Sanremo</h5></li></a>
                    <a href="#" className="flex-races-a" onClick={() => this.handleRace('Ronde van Vlaanderen')}>
                        <li className="flex-races"><h5 className="race-title">Ronde van Vlaanderen</h5></li></a>
                    <a href="#" className="flex-races-a" onClick={() => this.handleRace('Paris-Roubaix')}>
                        <li className="flex-races"><h5 className="race-title">Paris-Roubaix</h5></li></a>
                    <a href="#" className="flex-races-a" onClick={() => this.handleRace('Liège-Bastogne-Liège')}>
                        <li className="flex-races"><h5 className="race-title">Liège-Bastogne-Liège</h5></li></a>
                    <a href="#" className="flex-races-a" onClick={() => this.handleRace('Giro di Lombardia')}>
                        <li className="flex-races"><h5 className="race-title">Giro di Lombardia</h5></li></a>
                </ul>
            </div>
        )
    }
}

class HomeHeader extends React.Component {
    render() {
        return (
            <div className="home-head">
                <h1>THE MONUMENTS</h1>
            </div>
        )
    }
}

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let props = this.props;
        //Add About link
        return (
            <div className="home-grid">
                <HomeHeader/>
                <HomeClassique {...props}/>
                <HomeCyclist {...props}/>
            </div>
        )
    }
}

export default Home;
