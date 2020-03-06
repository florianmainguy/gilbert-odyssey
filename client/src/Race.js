import React from 'react';
import ReactCountryFlag from "react-country-flag"
import {Line} from 'react-chartjs-2';

class RaceHistory extends React.Component {
    constructor(props) {
        super(props);
        this.handleCyclist = this.handleCyclist.bind(this);
        this.renderTable = this.renderTable.bind(this);
    }

    handleCyclist(cyclistName) {
        this.props.props.handlerRightUI('cyclist', cyclistName);
    }

    renderTable() {
        if (!this.props.history) {
            return null;
        }

        return (this.props.history.reverse().map(( listValue, index ) => {
            return (
                <tr key={index}>
                    <td>{listValue.year}</td>
                    <td><ReactCountryFlag countryCode={listValue.flag}/></td>
                    <td><a href="#" onClick={() => this.handleCyclist(listValue.winner)} className="stretched-link">{listValue.winner}</a></td>
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
                                <th scope="column">Nat</th>
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

class RaceWinners extends React.Component {
    constructor(props) {
        super(props);
        this.handleCyclist = this.handleCyclist.bind(this);
        this.renderTable = this.renderTable.bind(this);
    }

    handleCyclist(cyclistName) {
        this.props.props.handlerRightUI('cyclist', cyclistName);
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
              acc.push({ name: obj.winner, count: 1, flag: obj.flag });
            }
            return acc;
        }, []);

        winners.sort(function(a,b) {
            return b.count - a.count;
        });

        return (winners.map(( listValue, index ) => {
            return (
                <tr key={index}>
                    <td className="winsColumn">{listValue.count}</td>
                    <td><ReactCountryFlag countryCode={listValue.flag}/></td>
                    <td><a href="#" onClick={() => this.handleCyclist(listValue.name)} className="stretched-link">{listValue.name}</a></td>
                </tr>
            );
        }));
    }

    render() {
        return (
            <div className="race-winners">
                <h6>Best Monument Winners</h6>
                <div className="border border-dark table-responsive">
                    <table className="table table-dark table-sm table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="column">Wins</th>
                                <th scope="column">Nat</th>
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
        this.state = {
            raceName: ''
        }
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
        // Keep in state classique data for unmounting/sliding transition
        let classique = this.props.classiques.find(x => x.raceName === this.props.focusOn);
        if (classique) {
            this.state.raceName = classique.raceName;
        }

        return (
            <div className="race-head border border-dark">
                <ul className="race-selector">
                    <li className="flex-races"><a className="race-left" href="#40" onClick={() => this.toRace('previous')}><span className="icon fontawesome-arrow-left scnd-font-color"></span></a></li>
                    <li className="flex-races"><h3 className="race-title">{this.state.raceName}</h3></li>
                    <li className="flex-races"><a className="race-right" href="#42" onClick={() => this.toRace('next')}><span className="icon fontawesome-arrow-right scnd-font-color"></span></a></li>
                </ul>
            </div>
        )
    }
}

class RaceProfile extends React.Component {
    constructor(props) {
        super(props);
        this.renderChart = this.renderChart.bind(this);
    }

    renderChart() {
        if (!this.props.history) {
            return null;
        }

        let dataChart = {
            labels: Array(this.props.elevation.length).map((x) => x),
            datasets: [
              {
                label: "Elevation",
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 0.5,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 0.5,
                pointHitRadius: 10,
                data: this.props.elevation
              }
            ]
          };

          // Maybe add tooltip and x axis
          let options = {
              legend: {
                  display: false
              },
              tooltips: {
                  enabled: false
              },
              maintainAspectRatio: false,
              scales:{
                xAxes: [{
                    display: false
                }]
            }
          }
        
        return <Line data={dataChart} options={options}/>
    }

    // Add chart into new div
    render() {
        return (
            <div className="race-chart border border-dark">
                <h6>Elevation Profile</h6>
                <div className="chart">
                    <this.renderChart/>
                </div>
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
        this.renderProfile = this.renderProfile.bind(this);
    }

    renderHead() {
        let props = this.props;

        return <RaceHead {...props}/>
    }

    renderWinners() {
        let params = {
            props: this.props,
            history: null 
        }

        let classique = this.props.classiques.find(x => x.raceName === this.props.focusOn);
        if (classique) {
            params.history = classique.history;
        }

        return <RaceWinners {...params}/>
    }

    renderHistory() {
        let params = {
            props: this.props,
            history: null 
        }

        let classique = this.props.classiques.find(x => x.raceName === this.props.focusOn);
        if (classique) {
            params.history = classique.history;
        }

        return <RaceHistory {...params}/>
    }

    renderProfile() {
        let params = {
            props: this.props,
            history: null,
            elevation: null
        }

        let classique = this.props.classiques.find(x => x.raceName === this.props.focusOn);
        if (classique) {
            params.history = classique.history;

            let coordinates = classique.geojsonData.features[2].geometry.coordinates;
            params.elevation = coordinates.map(point => point[2]);
        }

        return <RaceProfile {...params}/>
    }

    render() {
        return (
            <div className="race-grid">
                <this.renderHead/>
                <this.renderWinners/>
                <this.renderHistory/>
                <this.renderProfile/>
            </div>
        )
    }
}

export default Race;