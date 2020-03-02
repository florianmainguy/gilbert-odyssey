import React from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpZW5jaGllbjE2NjQiLCJhIjoiY2s0aDc0OHd2MTNpOTN0bzJyNjRzOWxpaiJ9.OAzfshgQGxK4VRYepd-ysw';

class Map extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          lng: -3.1699,
          lat: 47.1543,
          zoom: 5.05,
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
              <div ref={el => this.mapContainer = el} className="mapContainer"/>
          </div>
      )
  }
}

export default Map;