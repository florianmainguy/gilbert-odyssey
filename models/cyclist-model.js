var GeoJSON = require('mongoose-geojson-schema');
const mongoose = require('mongoose')

let cyclistSchema = new mongoose.Schema({
    cyclist: String,
    flag: String
});

module.exports = mongoose.model('cyclists', cyclistSchema)