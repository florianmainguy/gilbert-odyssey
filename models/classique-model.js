var GeoJSON = require('mongoose-geojson-schema');
const mongoose = require('mongoose')

let classiqueSchema = new mongoose.Schema({
    raceName: String,
    geojsonData: mongoose.Schema.Types.FeatureCollection
});

module.exports = mongoose.model('classiques', classiqueSchema)