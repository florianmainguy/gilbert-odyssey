import React from 'react';
import SearchCyclist from './search';

class HomeCyclist extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="home-cyclist">
                <h6>Find a Cyclist:</h6>
                <div className="home-search">
                    <SearchCyclist {...this.props}/>
                </div>
            </div>
        )
    }
}   

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
                <ul className="race-list">
                    <a href="#" className="race-link" onClick={() => this.handleRace('Milano-Sanremo')}>
                        <li className="flex-races"><h5>Milano-Sanremo</h5></li></a>
                    <a href="#" className="race-link" onClick={() => this.handleRace('Ronde van Vlaanderen')}>
                        <li className="flex-races"><h5>Ronde van Vlaanderen</h5></li></a>
                    <a href="#" className="race-link" onClick={() => this.handleRace('Paris-Roubaix')}>
                        <li className="flex-races"><h5>Paris-Roubaix</h5></li></a>
                    <a href="#" className="race-link" onClick={() => this.handleRace('Liège-Bastogne-Liège')}>
                        <li className="flex-races"><h5>Liège-Bastogne-Liège</h5></li></a>
                    <a href="#" className="race-link" onClick={() => this.handleRace('Giro di Lombardia')}>
                        <li className="flex-races"><h5>Giro di Lombardia</h5></li></a>
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
        //TODO Add About link
        return (
            <div className="main-grid home-grid">
                <HomeHeader/>
                <HomeClassique {...this.props}/>
                <HomeCyclist {...this.props}/>
            </div>
        )
    }
}

export default Home;
