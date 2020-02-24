import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import api from './api';
//import App from './App';
import * as serviceWorker from './serviceWorker';
import profilePic from './cyclists/default.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpZW5jaGllbjE2NjQiLCJhIjoiY2s0aDc0OHd2MTNpOTN0bzJyNjRzOWxpaiJ9.OAzfshgQGxK4VRYepd-ysw';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: 5.584,
            lat: 45.851,
            zoom: 4.65,
            pitch: 0, // pitch in degrees
            bearing: 0 // bearing in degrees
        };
    }

    zoomOnRace(race) {
        // Geographic coordinates of the LineString
        var coordinates = race.geojsonData.features[2].geometry.coordinates;

        // Pass the first coordinates in the LineString to `lngLatBounds` &
        // wrap each coordinate pair in `extend` to include them in the bounds
        // result. A variation of this technique could be applied to zooming
        // to the bounds of multiple Points or Polygon geomteries - it just
        // requires wrapping all the coordinates with the extend method.
        var bounds = coordinates.reduce(function(bounds, coord) {
        return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
        
        this.map.fitBounds(bounds, {
        padding: {top: 40, bottom:40, left: 15, right: 500}
        });
    }

    componentDidMount() {
        this.map = new mapboxgl.Map({
          container: this.mapContainer,
          style: 'mapbox://styles/chienchien1664/ck4k1ugrb1lr01cnxcrkxcvjr',
          center: [this.state.lng, this.state.lat],
          zoom: this.state.zoom,
          pitch: this.state.pitch,
          bearing: this.state.bearing
        });

        //console.log("this.state.classique", this.state.classiques);
        this.map.on('load', () => {
            for (let classique of this.props.classiques){
                let hoveredClassiqueId = null;

                //console.log("classique", classique);
                this.map.addSource(classique.raceName, { type: 'geojson', data: classique.geojsonData, generateId: true});
                this.map.addLayer({
                    'id': classique.raceName,
                    'type': 'line',
                    'source': classique.raceName,
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': "hsl(16, 93%, 49%)",
                        'line-width': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            8,
                            4
                        ]
                    }
                });

                // When the user moves their mouse over the classique line
                this.map.on('mousemove', classique.raceName, (e) => {
                    this.map.getCanvas().style.cursor = 'pointer';

                    if (hoveredClassiqueId) {
                        this.map.setFeatureState(
                            { source: classique.raceName, id: hoveredClassiqueId },
                            { hover: false }
                        );
                    }
                    hoveredClassiqueId = e.features[0].id;
                    this.map.setFeatureState(
                        { source: classique.raceName, id: hoveredClassiqueId },
                        { hover: true }
                    );
                });
                    
                // When the mouse leaves the classique line
                this.map.on('mouseleave', classique.raceName, () => {
                    this.map.getCanvas().style.cursor = '';

                    if (hoveredClassiqueId) {
                        this.map.setFeatureState(
                            { source: classique.raceName, id: hoveredClassiqueId },
                            { hover: false }
                        );
                    }
                    hoveredClassiqueId = null;
                });

                // When we click on the race, we zoom in and trigger the race right UI
                this.map.on('click', classique.raceName, () => {
                    this.zoomOnRace(classique);
                    this.props.handlerRightUI('race', classique.raceName);

                    // Remove hover bold effect
                    this.map.setFeatureState(
                        { source: classique.raceName, id: hoveredClassiqueId },
                        { hover: false }
                    );
                });
            };
        });

        this.map.on('move', () => {
            this.setState({
              lng: this.map.getCenter().lng.toFixed(4),
              lat: this.map.getCenter().lat.toFixed(4),
              zoom: this.map.getZoom().toFixed(2)
            });
        });
    }

    componentDidUpdate() {
        //Zoom on race when clicked on in right UI
        if (this.props.rightUI === 'race') {
            let classique = this.props.classiques.find(x => x.raceName === this.props.focusOn);
            this.zoomOnRace(classique);
        }
    }

    render() {
        return (
            <div>
                <div className='sidebarStyle'>
                    <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
                </div>
                <div ref={el => this.mapContainer = el} className="mapContainer"/>
            </div>
        )
    }
}


class CyclistProfile extends React.Component {
    render() {
        return (
            <div className="cyclist-profile border border-dark">
                <div className="cyclist-picture">
                    <img alt="Default picture" src={profilePic} />
                </div>
                <h4 className="cyclist-name">John Wick</h4>
                <form className="cyclist-search">
                    <input type="search" placeholder="Search Cyclist"/>
                </form>
            </div>
        )
    }
}

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
    render() {
        return (
            <div className="race-winners">
                <h6>Best Monuments Winners</h6>
                <div className="border border-dark table-responsive">
                    <table className="table table-dark table-sm table-striped">
                        <thead>
                            <tr>
                                <th scope="column">Wins</th>
                                <th scope="column">Nat.</th>
                                <th scope="column">Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>18</td>
                                <td>flag</td>
                                <td>John Wick</td>
                            </tr>
                            <tr>
                                <td>16</td>
                                <td>flag</td>
                                <td>Jean Philippe Smet</td>
                            </tr>
                            <tr>
                                <td>15</td>
                                <td>flag</td>
                                <td>Alain Delon</td>
                            </tr>
                            <tr>
                                <td>15</td>
                                <td>flag</td>
                                <td>Le conte de Monte Christo et sa maman</td>
                            </tr>
                            <tr>
                                <td>12</td>
                                <td>flag</td>
                                <td>Philippe Gilbert</td>
                            </tr>
                            <tr>
                                <td>12</td>
                                <td>flag</td>
                                <td>Julian Alaphilippe</td>
                            </tr>
                            <tr>
                                <td>12</td>
                                <td>flag</td>
                                <td>Eddy Merkx</td>
                            </tr>
                            <tr>
                                <td>12</td>
                                <td>flag</td>
                                <td>Alain Deloin</td>
                            </tr>
                            <tr>
                                <td>12</td>
                                <td>flag</td>
                                <td>Alain Detrèsloin</td>
                            </tr>
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

class CyclistSummary extends React.Component {
    render() {
        return (
            <div className="cyclist-summary border border-dark">
                <ul className="key-wins">
                    <li className="flex-wins"><a className="stage-wins" href="#40"><p><span className="icon fontawesome-comment-alt scnd-font-color"></span>5</p></a></li>
                    <li className="flex-wins"><a className="classique-wins" href="#41"><p><span className="icon fontawesome-eye-open scnd-font-color"></span>1</p></a></li>
                    <li className="flex-wins"><a className="total-wins" href="#42"><p><span className="icon fontawesome-heart-empty scnd-font-color"></span>23</p></a></li>
                </ul>
            </div>
        )
    }
}

class CyclistHistory extends React.Component {
    constructor(props) {
        super(props);
        this.renderTable = this.renderTable.bind(this);
    }

    renderTable() {
        if (!this.props.palmares) {
            return null;
        }

        return (this.props.palmares.map(( listValue, index ) => {
            return (
                <tr key={index}>
                    <td>{listValue.year}</td>
                    <td><a href="#" className="stretched-link">{listValue.race}</a></td>
                </tr>
            );
        }));
    }

    render() {
        return (
            <div className="cyclist-wins border border-dark table-responsive">
                <table className="table table-dark table-sm table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="column">Year</th>
                            <th scope="column">Race</th>
                        </tr>
                    </thead>
                    <tbody>
                        <this.renderTable/>
                    </tbody>
                </table>
            </div>
        )
    }
}

class Race extends React.Component {
    constructor(props) {
        super(props);
        this.renderHead = this.renderHead.bind(this);
        this.renderHistory = this.renderHistory.bind(this);
    }

    renderHead() {
        let props = this.props;

        //if (!classique) {
        //    return <RaceHead raceName = {null}/>
        //}

        return <RaceHead {...props}/>
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
                <RaceWinners />
                <this.renderHistory/>
            </div>
        )
    }
}

class Cyclist extends React.Component {
    constructor(props) {
        super(props);
        this.renderHistory = this.renderHistory.bind(this);
    }

    renderHistory() {
        let cyclist = this.props.cyclists.find(x => x.cyclist === this.props.focusOn);

        if (!cyclist) {
            return <CyclistHistory history = {null}/>
        }
        console.log(cyclist.palmares);
        return <CyclistHistory palmares = {cyclist.palmares}/>
    }

    render() {
        return (
            <div className="cyclist-container">
                <CyclistProfile />
                <CyclistSummary />
                <this.renderHistory/>
            </div>
        )
    }
}

class HomeCyclist extends React.Component {
    render() {
        return (
            <div className="home-cyclist border border-dark">
                <h6>Search for a Monument Winner</h6>
                <form className="cyclist-search">
                    <input type="search" placeholder="Search Cyclist"/>
                </form>
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
            <div className="home-classiques">
                <h6>Pick a race</h6>
                <ul className="classique-list">
                    <a href="#" onClick={() => this.handleRace('Milano-Sanremo')}>
                        <li className="flex-races"><h5 className="race-title">Milano-Sanremo</h5></li></a>
                    <a href="#" onClick={() => this.handleRace('Ronde van Vlaanderen')}>
                        <li className="flex-races"><h5 className="race-title">Ronde van Vlaanderen</h5></li></a>
                    <a href="#" onClick={() => this.handleRace('Paris-Roubaix')}>
                        <li className="flex-races"><h5 className="race-title">Paris-Roubaix</h5></li></a>
                    <a href="#" onClick={() => this.handleRace('Liège-Bastogne-Liège')}>
                        <li className="flex-races"><h5 className="race-title">Liège-Bastogne-Liège</h5></li></a>
                    <a href="#" onClick={() => this.handleRace('Giro di Lombardia')}>
                        <li className="flex-races"><h5 className="race-title">Giro di Lombardia</h5></li></a>
                </ul>
            </div>
        )
    }
}

class HomeHeader extends React.Component {
    render() {
        return (
            <div className="home-head border border-dark">
                <h1>Les Monuments</h1>
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
        return (
            <div className="home-container">
                <HomeHeader />
                <HomeClassique {...props}/>
                <HomeCyclist/>
            </div>
        )
    }
}

class RightUI extends React.Component {
    constructor(props) {
        super(props);
        this.renderRightUI = this.renderRightUI.bind(this);
    }

    renderRightUI() {
        let props = this.props;
        if (props.rightUI == 'race') {
            return <Race {...props}/>;
        }
        else if (props.rightUI == 'cyclist') {
            return <Cyclist {...props}/>;
        }
        else {
            return <Home {...props}/>;
        }
    }
    
    render() {
        let props = this.props;
        return (
            <div>
                <this.renderRightUI/>
            </div>
        )
    }
}

class Application extends React.Component {
    constructor(props) {
        super(props);
        this.handlerRightUI = this.handlerRightUI.bind(this);
        this.state = {
            rightUI: 'home',
            focusOn: 'Philippe Gilbert',
            classiques: [],
            cyclists: []
        };
    }

    handlerRightUI(themeUI, name) {
        this.setState({
            rightUI: themeUI,
            focusOn: name
        })
    }

    async componentDidMount() {
        await api.getAllClassiques()
        .then(response => {
            this.setState({
                classiques: response.data.data
            });
        })

        await api.getAllCyclists()
        .then(response => {
            this.setState({
                cyclists: response.data.data
            });
        })
    }

    render() {
        let props = {
            handlerRightUI: this.handlerRightUI,
            rightUI: this.state.rightUI,
            focusOn: this.state.focusOn,
            classiques: this.state.classiques,
            cyclists: this.state.cyclists
        }
        return (
            <div>
                <Map {...props}/>
                <RightUI {...props}/>
            </div>
        )
    }
}

const ThemeContext = React.createContext("race");

ReactDOM.render(<Application />, document.getElementById('app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();