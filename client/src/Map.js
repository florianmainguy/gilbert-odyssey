import React from 'react';
import mapboxgl from 'mapbox-gl';
import startPic from './map/start.png';
import finishPic from './map/finish.png';
import climbPic from './map/climb1.png';

// Mapbox Access Token has only public scope
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

    zoomOnRace(race) {
        let coordinates = race.geojsonData.features[2].geometry.coordinates;

        // Pass the first coordinates in the LineString to `lngLatBounds` &
        // wrap each coordinate pair in `extend` to include them in the bounds
        // result. A variation of this technique could be applied to zooming
        // to the bounds of multiple Points or Polygon geomteries - it just
        // requires wrapping all the coordinates with the extend method.
        let bounds = coordinates.reduce(function(bounds, coord) {
            return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        // Responsive layout 
        let y = window.matchMedia("(orientation: portrait)");
        if (y.matches) {
            bounds.setSouthWest({lng: bounds.getSouthWest().lng,
                lat: bounds.getSouthWest().lat - (bounds.getNorthEast().lat - bounds.getSouthWest().lat)});

            if (window.matchMedia("(max-width: 700px)").matches) {
                this.map.fitBounds(bounds, {
                    padding: {top: 130, bottom:230, left: 15, right: 15}
                });
            }
            else if (window.matchMedia("(max-width: 1000px)").matches) {
                this.map.fitBounds(bounds, {
                    padding: {top: 140, bottom:260, left: 15, right: 15}
                }); 
            }
            else {
                this.map.fitBounds(bounds, {
                    padding: {top: 170, bottom:320, left: 15, right: 15}
                });      
            }
        }
        else {
            if (window.matchMedia("(max-width: 750px)").matches) {
                this.map.fitBounds(bounds, {
                    padding: {top: 70, bottom:150, left: 30, right: 200}
                });
            }
            else if (window.matchMedia("(max-width: 800px)").matches) {
                this.map.fitBounds(bounds, {
                    padding: {top: 70, bottom:250, left: 30, right: 350}
                });
            }
            else if (window.matchMedia("(max-width: 1400px)").matches) {
                this.map.fitBounds(bounds, {
                    padding: {top: 70, bottom:275, left: 35, right: 400}
                });
            }
            else  if (window.matchMedia("(max-width: 2000px)").matches){
                this.map.fitBounds(bounds, {
                    padding: {top: 70, bottom:300, left: 15, right: 400}
                });
            }
            else {
                this.map.fitBounds(bounds, {
                    padding: {top: 70, bottom:550, left: 15, right: 480}
                });
            }
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
                        'icon-size': 0.5,
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
                        'icon-size': 0.5,
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
                        'icon-size': 0.4
                    },
                    'filter': ['==', ["get", "icon"], 'climb'],
                    'minzoom': 5
                });

                // Layer for race cobblestone
                this.map.addLayer({
                    'id': 'cobblestone ' + classique.raceName,
                    'type': 'line',
                    'source': classique.raceName,
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': "hsl(241, 80%, 50%)",
                        'line-width': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            4,
                            3
                        ]
                    },
                    'filter': ['==', ["get", "icon"], 'cobblestone'],
                    'minzoom': 5
                });

                let hoveredClassiqueId = null;
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

                // Add permanent Popups for start and finish
                classique.geojsonData.features.forEach((feature) => {
                    if (feature.properties.icon === 'start') {
                        new mapboxgl.Popup({ className: 'start-finish', closeOnClick: false})
                            .setLngLat(feature.geometry.coordinates)
                            .setHTML(feature.properties.name)
                            //Following code is to avoid blurry popup if odd pixels
                            //Waiting for a merge from mapbox gl js repo, so commented
                            /*.on('open', function (pop) {
                                let _container = pop.target._container;
                                console.log(feature.properties.name + _container);
                                console.log(_container.offsetWidth);
                                console.log(_container.outerWidth);
                                if(_container.offsetWidth % 2 !== 0){
                                    _container.style.width = (_container.offsetWidth + 1) + "px";
                                }
                            })*/
                            .addTo(this.map);
                    }                    
                });

                classique.geojsonData.features.forEach((feature) => {
                    if (feature.properties.icon === 'finish') {
                        new mapboxgl.Popup({ className: 'start-finish', closeOnClick: false})
                            .setLngLat(feature.geometry.coordinates)
                            .setHTML(feature.properties.name)
                            .addTo(this.map) 
                    }
                });

                // Add hover Popup to climbs and cobblestone
                let popup = new mapboxgl.Popup({
                    closeOnClick: false
                });

                this.map.on('mouseenter', 'climb ' + classique.raceName, (e) => {
                    this.map.getCanvas().style.cursor = 'pointer';

                    popup
                        .setLngLat(e.features[0].geometry.coordinates)
                        .setHTML(e.features[0].properties.name)
                        .addTo(this.map) 
                });

                this.map.on('mouseleave', 'climb ' + classique.raceName, () => {
                    this.map.getCanvas().style.cursor = '';
                    popup.remove();
                });

                this.map.on('mouseenter', 'cobblestone ' + classique.raceName, (e) => {
                    this.map.getCanvas().style.cursor = 'pointer';

                    popup
                        .setLngLat(e.lngLat)
                        .setHTML('<p style="font-weight: bold;">' + e.features[0].properties.name + '</p>' +
                                 '<p>' + e.features[0].properties.description + '</p>')
                        .addTo(this.map) 
                });

                this.map.on('mouseleave', 'cobblestone ' + classique.raceName, () => {
                    this.map.getCanvas().style.cursor = '';
                    popup.remove();
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

    componentDidUpdate(prevProps) {
        // Zoom on race when clicked on right UI
        if (this.props.focusOn !== prevProps.focusOn) {
            if (this.props.rightUI === 'race') {
                let classique = this.props.classiques.find(x => x.raceName === this.props.focusOn);
                this.zoomOnRace(classique);
            }
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