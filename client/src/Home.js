import React from 'react';
import SearchCyclist from './Search';

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
