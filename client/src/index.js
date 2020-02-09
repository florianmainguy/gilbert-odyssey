import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import './index.css';
import api from './api';
//import App from './App';
import * as serviceWorker from './serviceWorker';
import profilePic from './cyclists/default.png';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpZW5jaGllbjE2NjQiLCJhIjoiY2s0aDc0OHd2MTNpOTN0bzJyNjRzOWxpaiJ9.OAzfshgQGxK4VRYepd-ysw';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: 5.584,
            lat: 45.851,
            zoom: 4.65,
            pitch: 0, // pitch in degrees
            bearing: 0, // bearing in degrees
            classiques: []
        };
    }

    async componentDidMount() {
        const map = new mapboxgl.Map({
          container: this.mapContainer,
          style: 'mapbox://styles/chienchien1664/ck4k1ugrb1lr01cnxcrkxcvjr',
          center: [this.state.lng, this.state.lat],
          zoom: this.state.zoom,
          pitch: this.state.pitch,
          bearing: this.state.bearing
        });

        await api.getAllClassiques()
            .then(response => {
                this.setState({
                    classiques: response.data.data
                });
            })

        //console.log("this.state.classique", this.state.classiques);
        map.on('load', () => {
            for (let classique of this.state.classiques){
                let hoveredClassiqueId = null;

                //console.log("classique", classique);
                map.addSource(classique.raceName, { type: 'geojson', data: classique.geojsonData, generateId: true});
                map.addLayer({
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
                map.on('mousemove', classique.raceName, function(e) {
                    map.getCanvas().style.cursor = 'pointer';

                    if (hoveredClassiqueId) {
                        map.setFeatureState(
                            { source: classique.raceName, id: hoveredClassiqueId },
                            { hover: false }
                        );
                    }
                    hoveredClassiqueId = e.features[0].id;
                    map.setFeatureState(
                        { source: classique.raceName, id: hoveredClassiqueId },
                        { hover: true }
                    );
                });
                    
                // When the mouse leaves the classique line
                map.on('mouseleave', classique.raceName, function(e) {
                    map.getCanvas().style.cursor = '';

                    if (hoveredClassiqueId) {
                        map.setFeatureState(
                            { source: classique.raceName, id: hoveredClassiqueId },
                            { hover: false }
                        );
                    }
                    hoveredClassiqueId = null;
                });

                map.on('click', classique.raceName, function() {
                    // Geographic coordinates of the LineString
                    var coordinates = classique.geojsonData.features[2].geometry.coordinates;
                    
                    // Pass the first coordinates in the LineString to `lngLatBounds` &
                    // wrap each coordinate pair in `extend` to include them in the bounds
                    // result. A variation of this technique could be applied to zooming
                    // to the bounds of multiple Points or Polygon geomteries - it just
                    // requires wrapping all the coordinates with the extend method.
                    var bounds = coordinates.reduce(function(bounds, coord) {
                    return bounds.extend(coord);
                    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
                    
                    map.fitBounds(bounds, {
                    padding: {top: 40, bottom:40, left: 15, right: 500}
                    //TODO: padding right, something like:
                    //document.getElementById('your_div').offsetWidth + 5
                    });

                });
            };
        });

        map.on('move', () => {
            this.setState({
              lng: map.getCenter().lng.toFixed(4),
              lat: map.getCenter().lat.toFixed(4),
              zoom: map.getZoom().toFixed(2)
            });
        });
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

/*
class CyclistPic extends React.Component {
    render() {
        return (
            <div>
                <div>Picture</div>
            </div>
        )
    }
}

class CyclistName extends React.Component {
    render() {
        return (
            <div>
                <div>Name</div>
            </div>
        )
    }
}

class CyclistKeyWins extends React.Component {
    render() {
        return (
            <div>
                <div>KeyWins</div>
            </div>
        )
    }
}*/

class CyclistKeyInfos extends React.Component {
    render() {
        return (
            <div>
                <div className="middle-container container">
                    <div className="profile block">
                        <div className="profile-picture big-profile-picture clear">
                            <img width="150px" alt="Default picture" src={profilePic} />
                        </div>
                        <h1 className="user-name">John Wick</h1>
                        <form id="demo-2">
                            <input type="search" placeholder="Search Cyclist"/>
                        </form>
                        <ul className="profile-options horizontal-list">
                            <li><a className="comments" href="#40"><p><span className="icon fontawesome-comment-alt scnd-font-color"></span>23</p></a></li>
                            <li><a className="views" href="#41"><p><span className="icon fontawesome-eye-open scnd-font-color"></span>841</p></a></li>
                            <li><a className="likes" href="#42"><p><span className="icon fontawesome-heart-empty scnd-font-color"></span>49</p></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

class CyclistHistory extends React.Component {
    render() {
        return (
            <div>
                <div className="middle-container container">
                    <div class="table">
                        <div class="row header">
                            <div class="cell">
                                Date
                            </div>
                            <div class="cell">
                                Name
                            </div>
                        </div>
                        
                        <div class="row">
                        <div class="cell" data-title="Date">
                            2019
                        </div>
                        <div class="cell" data-title="Name">
                            Milan-Sanremo
                        </div>
                        </div>

                        <div class="row">
                        <div class="cell" data-title="Date">
                            2017
                        </div>
                        <div class="cell" data-title="Name">
                            Paris-Roubaix
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class Cyclist extends React.Component {
    render() {
        return (
            <div className="main-container">
                <CyclistKeyInfos />
                <CyclistHistory />
            </div>
        )
    }
}

class RightUI extends React.Component {
    //TODO: conditionnal to get Cyclist/Monument/Home UI
    render() {
        return (
            <div className='rightUI'>
                <Cyclist />
            </div>
        )
    }
}

class Application extends React.Component {
    render() {
        return (
            <div>
                <Map />
                <RightUI />
            </div>
        )
    }
}

ReactDOM.render(<Application />, document.getElementById('app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();