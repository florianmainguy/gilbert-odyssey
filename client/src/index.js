import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import './index.css';
import api from './api';
//import App from './App';
import * as serviceWorker from './serviceWorker';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpZW5jaGllbjE2NjQiLCJhIjoiY2s0aDc0OHd2MTNpOTN0bzJyNjRzOWxpaiJ9.OAzfshgQGxK4VRYepd-ysw';

class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: 7.254,
            lat: 46.880,
            zoom: 5.5,
            pitch: 39, // pitch in degrees
            bearing: -16, // bearing in degrees
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

        api.getAllClassiques()
            .then(response => {
                this.setState({
                    classiques: response.data
                });
            });

        const milan = await api.getAllClassiques();
        console.log(milan.data.data);
        console.log(this.state.classiques.data);

        const milan2 = this.state.classiques.data.find(classique => (classique.name == 'milan-sanremo'));
        console.log(milan2);

        map.on('load', () => {
            map.addSource('roubaix2019', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/paris_roubaix_2019.geojson'});
            map.addSource('flandres2016', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/Tour-des-Flandres-2016.geojson'});
            map.addSource('milan2014', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/Milan-Sanremo-2014.geojson'});
            //map.addSource('milan-sanremo', { type: 'geojson', data: {} });
            map.addSource('lombardia2015', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/Il_Lombardia_2015.geojson'});
            map.addSource('amstel2019', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/Amstel-Gold-Race-2019.geojson'});
            map.addSource('gent2017', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/Gent-Wewelgem-2017.geojson'});
            map.addSource('nice2018', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/Paris-Nice-2018.geojson'});
            map.addSource('liege2017', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/Liege-Bastogne-Liege-2017.geojson'});

            //map.getSource('milan-sanremo').setData(api.getClassique('milan-sanremo'));

                    
            //.then( (response) => {
            //    console.log(response.data.data);
            //});;
            //console.log(this.state.classiques);
            //TO DO: make sure milan is geojson type

            map.addSource('milan-sanremo', { type: 'geojson', data: milan2});
            map.addLayer({
                'id': 'milan',
                'type': 'line',
                'source': 'milan-sanremo',
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
          </div>
        )
    }
}

ReactDOM.render(<Application />, document.getElementById('app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();