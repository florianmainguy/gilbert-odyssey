import React from 'react';
import mapboxgl from 'mapbox-gl';
import startPic from './map/start.png';
import finishPic from './map/finish.png';
import climbPic from './map/climb1.png';

//TODO Hide access token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpZW5jaGllbjE2NjQiLCJhIjoiY2s0aDc0OHd2MTNpOTN0bzJyNjRzOWxpaiJ9.OAzfshgQGxK4VRYepd-ysw';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: -5.2394,
            lat: 46.8270,
            zoom: 4.87,
        };
    }

  //TODO default coord for mobile
  /*{
    "lng": "1.4177",
    "lat": "45.7013",
    "zoom": "3.34"
  }*/

    zoomOnRace(race) {
        //TODO keep coord in features[2] ??
        var coordinates = race.geojsonData.features[2].geometry.coordinates;

        // Pass the first coordinates in the LineString to `lngLatBounds` &
        // wrap each coordinate pair in `extend` to include them in the bounds
        // result. A variation of this technique could be applied to zooming
        // to the bounds of multiple Points or Polygon geomteries - it just
        // requires wrapping all the coordinates with the extend method.
        var bounds = coordinates.reduce(function(bounds, coord) {
            return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
        
        // Responsive layout 
        let x = window.matchMedia("(max-width: 768px)");
        if (x.matches) {
            this.map.fitBounds(bounds, {
                padding: {top: 120, bottom:450, left: 15, right: 15}
            });
        }
        else {
            this.map.fitBounds(bounds, {
                padding: {top: 70, bottom:250, left: 15, right: 400}
            }); 
        }  
    }

    componentDidMount() {
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/chienchien1664/ck4k1ugrb1lr01cnxcrkxcvjr?optimize=true',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
        });

        this.map.loadImage(startPic, (error, image) => {
            this.map.addImage('start', image);
        });
        this.map.loadImage(finishPic, (error, image) => {
            this.map.addImage('finish', image);
        });
        this.map.loadImage(climbPic, (error, image) => {
            this.map.addImage('climb', image);
        });

        this.map.on('load', () => {
            for (let classique of this.props.classiques){
                let hoveredClassiqueId = null;

                this.map.addSource(classique.raceName, { type: 'geojson', data: classique.geojsonData, generateId: true});

                // Layer for actual race linestring
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
                            4,
                            3
                        ]
                    }
                });

                // Layer for race start
                this.map.addLayer({
                    'id': 'start ' + classique.raceName,
                    'type': 'symbol',
                    'source': classique.raceName,
                    'layout': {
                        'icon-image': 'start',
                        'icon-size': 0.4,
                        "icon-allow-overlap": true
                    },
                    'filter': ['==', ["get", "icon"], 'start']
                });

                // Layer for race finish
                this.map.addLayer({
                    'id': 'finish ' + classique.raceName,
                    'type': 'symbol',
                    'source': classique.raceName,
                    'layout': {
                        'icon-image': 'finish',
                        'icon-size': 0.4,
                        "icon-allow-overlap": true
                    },
                    'filter': ['==', ["get", "icon"], 'finish']
                });

                // Layer for race climbs
                this.map.addLayer({
                    'id': 'climb ' + classique.raceName,
                    'type': 'symbol',
                    'source': classique.raceName,
                    'layout': {
                        'icon-image': 'climb',
                        'icon-size': 0.2
                    },
                    'filter': ['==', ["get", "icon"], 'climb'],
                    'minzoom': 7
                });

//Add permanent POPUp, how? Change to marker?
                // When a click event occurs on a feature in the places layer, open a popup at the
                // location of the feature, with description HTML from its properties.
                /*this.map.on('click', 'climb ' + classique.raceName, (e) => {
                    var coordinates = e.features[0].geometry.coordinates.slice();
                    var description = "test";
                    console.log(coordinates);
                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                    
                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(description)
                        .addTo(this.map)
                });*/

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

                //TODO Add zoom and rotation controls to the map.
                //this.map.addControl(new mapboxgl.NavigationControl());

                // Add Popup to icons
                classique.geojsonData.features.forEach((feature) => {
                    if (feature.properties.icon === 'climb') {
                        new mapboxgl.Popup()
                            .setLngLat(feature.geometry.coordinates)
                            .setHTML(feature.properties.name)
                            .addTo(this.map) 
                    }
                });

                classique.geojsonData.features.forEach((feature) => {
                    if (feature.properties.icon === 'start') {
                        new mapboxgl.Popup()
                            .setLngLat(feature.geometry.coordinates)
                            .setHTML(feature.properties.name)
                            .addTo(this.map) 
                    }
                });

                classique.geojsonData.features.forEach((feature) => {
                    if (feature.properties.icon === 'finish') {
                        new mapboxgl.Popup()
                            .setLngLat(feature.geometry.coordinates)
                            .setHTML(feature.properties.name)
                            .addTo(this.map) 
                    }
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
        // Zoom on race when clicked on right UI
        if (this.props.rightUI === 'race') {
            let classique = this.props.classiques.find(x => x.raceName === this.props.focusOn);
            this.zoomOnRace(classique);
        }
    }

    render() {
        return (
            <div>
                <div ref={el => this.mapContainer = el} className="map-container"/>
            </div>
        )
    }
}

export default Map;