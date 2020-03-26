const mongoose = require('mongoose');
const GeoJSON = require('mongoose-geojson-schema');

const classiqueSchema = new mongoose.Schema({
    raceName: String,
    geojsonData: mongoose.Schema.Types.FeatureCollection
});
const classiquesModel = mongoose.model('classiques', classiqueSchema);


const cyclistSchema = new mongoose.Schema({
    cyclist: String,
    flag: String
});
const cyclistsModel = mongoose.model('cyclists', cyclistSchema);

module.exports = {
    classiquesModel,
    cyclistsModel
}