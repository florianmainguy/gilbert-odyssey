import React from 'react';

class RaceHistory extends React.Component {
    constructor(props) {
        super(props);
        this.renderTable = this.renderTable.bind(this);
    }

    renderTable() {
        if (!this.props.history) {
            return null;
        }

        return (this.props.history.map(( listValue, index ) => {
            return (
                <tr key={index}>
                    <td>{listValue.year}</td>
                    <td>{listValue.flag}</td>
                    <td><a href="#" className="stretched-link">{listValue.winner}</a></td>
                </tr>
            );
        }));
    }

    render() {
        return (
            <div className="race-history">
                <h6>Race History</h6>
                <div className="border border-dark table-responsive">
                    <table className="table table-dark table-sm table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="column">Year</th>
                                <th scope="column">Flag</th>
                                <th scope="column">Winner</th>
                            </tr>
                        </thead>
                        <tbody>
                            <this.renderTable/>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

class RaceWinners extends React.Component {
    constructor(props) {
        super(props);
        this.renderTable = this.renderTable.bind(this);
    }

    renderTable() {
        if (!this.props.history) {
            return null;
        }

        // Creates an array of Winner/Number of wins, then sorts it
        let winners = this.props.history.reduce(function(acc, obj) {
            const found = acc.find(a => a.name === obj.winner);
            if (found) {
              found.count += 1;
            }
            else {
              acc.push({ name: obj.winner, count: 1 });
            }
            return acc;
        }, []);

        winners.sort(function(a,b) {
            return b.count - a.count;
        });

        return (winners.map(( listValue, index ) => {
            return (
                <tr key={index}>
                    <td>{listValue.count}</td>
                    <td><a href="#" className="stretched-link">{listValue.name}</a></td>
                </tr>
            );
        }));
    }

    render() {
        return (
            <div className="race-winners">
                <h6>Best Monuments Winners</h6>
                <div className="border border-dark table-responsive">
                    <table className="table table-dark table-sm table-striped">
                        <thead>
                            <tr>
                                <th scope="column">Wins</th>
                                <th scope="column">Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <this.renderTable/>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

class RaceHead extends React.Component {
    constructor(props) {
        super(props);
        this.handleRace = this.handleRace.bind(this);
        this.toRace = this.toRace.bind(this);
    }

    handleRace(raceName) {
        this.props.handlerRightUI('race', raceName);
    }

    toRace(direction) {
        let classique = this.props.classiques.find(x => x.raceName === this.props.focusOn);
        let races = ['Milano-Sanremo', 'Ronde van Vlaanderen', 'Paris-Roubaix', 'Liège-Bastogne-Liège', 'Giro di Lombardia'];
        let raceIdx = races.indexOf(classique.raceName);
        let len = races.length;

        if (direction === 'next') {
            return this.handleRace(races[(raceIdx+1)%len]);
        }
        else if (direction === 'previous') {
            return this.handleRace(races[(raceIdx+len-1)%len]);
        }
    }

    render() {
        let raceName = this.props.classiques.find(x => x.raceName === this.props.focusOn).raceName;
        return (
            <div className="race-head border border-dark">
                <ul className="race-selector">
                    <li className="flex-races"><a className="race-left" href="#40" onClick={() => this.toRace('previous')}><span className="icon fontawesome-arrow-left scnd-font-color"></span></a></li>
                    <li className="flex-races"><h3 className="race-title">{raceName}</h3></li>
                    <li className="flex-races"><a className="race-right" href="#42" onClick={() => this.toRace('next')}><span className="icon fontawesome-arrow-right scnd-font-color"></span></a></li>
                </ul>
            </div>
        )
    }
}

class Race extends React.Component {
    constructor(props) {
        super(props);
        this.renderHead = this.renderHead.bind(this);
        this.renderWinners = this.renderWinners.bind(this);
        this.renderHistory = this.renderHistory.bind(this);
    }

    renderHead() {
        let props = this.props;

        //if (!classique) {
        //    return <RaceHead raceName = {null}/>
        //}

        return <RaceHead {...props}/>
    }

    renderWinners() {
        let classique = this.props.classiques.find(x => x.raceName === this.props.focusOn);

        if (!classique) {
            return <RaceWinners history = {null}/>
        }

        return <RaceWinners history = {classique.history}/>
    }

    renderHistory() {
        let classique = this.props.classiques.find(x => x.raceName === this.props.focusOn);

        if (!classique) {
            return <RaceHistory history = {null}/>
        }

        return <RaceHistory history = {classique.history}/>
    }

    render() {
        return (
            <div className="race-container">
                <this.renderHead/>
                <this.renderWinners/>
                <this.renderHistory/>
            </div>
        )
    }
}

export default Race;