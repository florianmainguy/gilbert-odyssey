import React from 'react';
import ReactCountryFlag from "react-country-flag"
import {Line} from 'react-chartjs-2';
import * as turf from '@turf/turf';

class RaceProfile extends React.Component {
    constructor(props) {
        super(props);
        this.renderChart = this.renderChart.bind(this);
    }

    renderChart() {
        if (!this.props.classique) {
            return null;
        }

        let dataChart = {
            labels: this.props.chart.elevation.map((val, idx) => Math.round(idx*this.props.chart.distance/this.props.chart.elevation.length)),
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
                data: this.props.chart.elevation
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
                display: true,
                ticks: {
                    //sampleSize: 100   Nto wirking :(
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true,
                    suggestedMax: 1200
                }
            }]
            },
            animation: {
            duration: 0
        }
        }
    
        return <Line data={dataChart} options={options}/>
    }

    // Add chart into new div
    render() {
        return (
            <div className="race-chart border border-dark">
                <h6>Elevation Profile (m/km)</h6>
                <div className="chart">
                    <this.renderChart/>
                </div>
            </div>
        )
    }
}

class RaceHistory extends React.Component {
    constructor(props) {
        super(props);
        this.handleCyclist = this.handleCyclist.bind(this);
        this.renderTable = this.renderTable.bind(this);
    }

    handleCyclist(cyclistName) {
        this.props.handlerRightUI('cyclist', cyclistName);
    }

    renderTable() {
        // Copy history array by value otherwise reference array is reverse sorted at every render
        let history = this.props.classique.history.slice();

        return (history.reverse().map(( listValue, index ) => {
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
        if (!this.props.classique) {
            return null;
        }

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
        this.props.handlerRightUI('cyclist', cyclistName);
    }

    renderTable() {
        // Create an array of Winner/Number of wins, then sort it
        let winners = this.props.classique.history.reduce(function(acc, obj) {
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
        if (!this.props.classique) {
            return null;
        }

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
        this.goToRace = this.goToRace.bind(this);
        this.races = ['Milano-Sanremo', 'Ronde van Vlaanderen', 'Paris-Roubaix', 'Liège-Bastogne-Liège', 'Giro di Lombardia'];
    }

    handleRace(raceName) {
        this.props.handlerRightUI('race', raceName);
    }

    goToRace(direction) {
        let raceIdx = this.races.indexOf(this.props.classique.raceName);
        let len = this.races.length;

        if (direction === 'next') {
            return this.handleRace(this.races[(raceIdx+1)%len]);
        }
        else if (direction === 'previous') {
            return this.handleRace(this.races[(raceIdx+len-1)%len]);
        }
    }

    render() {
        if (!this.props.classique){
            return null;
        }

        return (
            <div className="race-head border border-dark">
                <ul className="race-selector">
                    <li className="flex-races"><a className="race-left" href="#40" onClick={() => this.goToRace('previous')}><span className="icon fontawesome-angle-left scnd-font-color"></span></a></li>
                    <li className="flex-races"><h3 className="race-title">{this.props.classique.raceName}</h3></li>
                    <li className="flex-races"><a className="race-right" href="#42" onClick={() => this.goToRace('next')}><span className="icon fontawesome-angle-right scnd-font-color"></span></a></li>
                </ul>
            </div>
        )
    }
}

class Race extends React.Component {
    constructor(props) {
        super(props);
        this.renderProfile = this.renderProfile.bind(this);
        this.state = {
            classique: null
        };
    }

    renderProfile() {
        let chart = {
            elevation: null,
            distance: null
        }

        if (this.state.classique) {
            let coordinates = this.state.classique.geojsonData.features[2].geometry.coordinates;

            // Takes only sample of coordinates, to avoid lagging of chart drawing
            var filtered = coordinates.filter(function(element, index, array) {
                return (index % 30 === 0);
            });
              
            chart.elevation = filtered.map(point => point[2]);
            chart.distance = turf.length(this.state.classique.geojsonData.features[2]);
        }

        return <RaceProfile chart={chart} classique={this.state.classique}/>
    }

    componentDidMount() {
        this.setState({classique: this.props.classiques.find(x => x.raceName === this.props.focusOn)});
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.focusOn !== prevProps.focusOn) {
            this.setState({classique: this.props.classiques.find(x => x.raceName === this.props.focusOn)});
        }
    }

    render() {
        return (
            <div className="main-grid race-grid">
                <RaceHead {...this.props} classique={this.state.classique}/>
                <RaceWinners {...this.props} classique={this.state.classique}/>
                <RaceHistory {...this.props} classique={this.state.classique}/>
                <this.renderProfile/>
            </div>
        )
    }
}

export default Race;