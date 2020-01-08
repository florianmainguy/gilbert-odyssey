import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpZW5jaGllbjE2NjQiLCJhIjoiY2s0aDc0OHd2MTNpOTN0bzJyNjRzOWxpaiJ9.OAzfshgQGxK4VRYepd-ysw';

class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: 7.254,
            lat: 46.880,
            zoom: 5.5
        };
    }

    state = {
        data: null
    };

    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
    callBackendAPI = async () => {
        const response = await fetch('/express_backend');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    };
    
    componentDidMount() {
        const map = new mapboxgl.Map({
          container: this.mapContainer,
          style: 'mapbox://styles/chienchien1664/ck4k1ugrb1lr01cnxcrkxcvjr',
          center: [this.state.lng, this.state.lat],
          pitch: 39, // pitch in degrees
          bearing: -16, // bearing in degrees
          zoom: this.state.zoom
        });
        
        // Call our fetch function below once the component mounts
        this.callBackendAPI()
            .then(res => this.setState({ data: res.express }))
            .catch(err => console.log(err));


        map.on('load', () => {
            map.addSource('roubaix2019', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/map_data/paris_roubaix_2019.geojson'});
            map.addSource('flandres2016', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/map_data/Tour-des-Flandres-2016.geojson'});
            map.addSource('milan2014', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/map_data/Milan-Sanremo-2014.geojson'});
            map.addSource('lombardia2015', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/map_data/Il_Lombardia_2015.geojson'});
            //map.addSource('amstel2019', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/map_data/Amstel-Gold-Race-2019.geojson'});
            //map.addSource('gent2017', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/map_data/Gent-Wewelgem-2017.geojson'});
            //map.addSource('nice2018', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/map_data/Paris-Nice-2018.geojson'});
            map.addSource('liege2017', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/map_data/Liege-Bastogne-Liege-2017.geojson'});
            
            map.addLayer({
                'id': 'roubaix',
                'type': 'line',
                'source': 'roubaix2019',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#888',
                    'line-width': 8
                }
            });

            map.addLayer({
                'id': 'flandres',
                'type': 'line',
                'source': 'flandres2016',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#888',
                    'line-width': 8
                }
            });

            map.addLayer({
                'id': 'milan',
                'type': 'line',
                'source': 'milan2014',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#888',
                    'line-width': 8
                }
            });

            map.addLayer({
                'id': 'lombardia',
                'type': 'line',
                'source': 'lombardia2015',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#888',
                    'line-width': 8
                }
            });

            map.addLayer({
                'id': 'amstel',
                'type': 'line',
                'source': 'amstel2019',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#888',
                    'line-width': 8
                }
            });

            map.addLayer({
                'id': 'gent',
                'type': 'line',
                'source': 'gent2017',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#888',
                    'line-width': 8
                }
            });

            map.addLayer({
                'id': 'nice',
                'type': 'line',
                'source': 'nice2018',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#888',
                    'line-width': 8
                }
            });

            map.addLayer({
                'id': 'liege',
                'type': 'line',
                'source': 'liege2017',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#888',
                    'line-width': 8
                }
            });
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

            // Render the newly fetched data inside of this.state.data 
            <p className="App-intro">{this.state.data}</p>
          </div>
        )
    }
}

ReactDOM.render(<Application />, document.getElementById('app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();