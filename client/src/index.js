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
    render() {
        return (
            <div className="cyclist-wins border border-dark table-responsive">
                <table className="table table-dark table-sm table-striped">
                    <thead>
                        <tr>
                            <th scope="column">Year</th>
                            <th scope="column">Race</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2019</td>
                            <td>Milan-Sanremo</td>
                        </tr>
                        <tr>
                            <td>2019</td>
                            <td>Paris-Roubaix</td>
                        </tr>
                        <tr>
                            <td>2018</td>
                            <td>Milan-Sanremo</td>
                        </tr>
                        <tr>
                            <td>2018</td>
                            <td>Milan-Sanremo</td>
                        </tr>
                        <tr>
                            <td>2018</td>
                            <td>Paris-Roubaix</td>
                        </tr>
                        <tr>
                            <td>2017</td>
                            <td>Paris-Roubaix</td>          
                        </tr>
                        <tr>
                            <td>2016</td>
                            <td>Paris-Roubaix</td>
                        </tr>
                        <tr>
                            <td>2016</td>
                            <td>Milan-Sanremo</td>
                        </tr>
                        <tr>
                            <td>2016</td>
                            <td>Milan-Sanremo</td>
                        </tr>
                        <tr>
                            <td>2015</td>
                            <td>Paris-Roubaix</td>
                        </tr>
                        <tr>
                            <td>2014</td>
                            <td>Paris-Roubaix</td>          
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

class Cyclist extends React.Component {
    render() {
        return (
            <div className="cyclist-container">
                <CyclistProfile />
                <CyclistSummary />
                <CyclistHistory />
            </div>
        )
    }
}

class RightUI extends React.Component {
    //TODO: conditionnal to get Cyclist/Monument/Home UI
    render() {
        return (
            <div>
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