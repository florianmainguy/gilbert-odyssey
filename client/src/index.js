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

        console.log("this.state.classique", this.state.classiques);
        map.on('load', () => {
            for (let classique of this.state.classiques){
                console.log("classique", classique);
                map.addSource(classique.raceName, { type: 'geojson', data: classique.geojsonData});
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
                        'line-width': 4
                    }
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

/*
        map.addSource('roubaix2019', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/paris_roubaix_2019.geojson'});
        map.addSource('flandres2016', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/Tour-des-Flandres-2016.geojson'});
        map.addSource('milan2014', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/Milan-Sanremo-2014.geojson'});
        //map.addSource('milan-sanremo', { type: 'geojson', data: {} });
        map.addSource('lombardia2015', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/Il_Lombardia_2015.geojson'});
        map.addSource('amstel2019', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/Amstel-Gold-Race-2019.geojson'});
        map.addSource('gent2017', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/Gent-Wewelgem-2017.geojson'});
        map.addSource('nice2018', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/Paris-Nice-2018.geojson'});
        map.addSource('liege2017', { type: 'geojson', data: 'https://florianmainguy.github.io/gilbert-odyssey/assets/map_data/Liege-Bastogne-Liege-2017.geojson'});
*/

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