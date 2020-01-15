const mongoose = require('mongoose')

let Classique = new mongoose.Schema({
    type: String,
    name: String,
    style: {
        color: String,
        weight: Number,
        opacity: Number
    },
    geometry: {
        type: {
            type: String,
            enum: ['LineString'],
            required: true
        },
        coordinates: {
            type: Array,
            index: '2d'
        }
    },
    properties: {
        direction: String,
        power: Number
    }
});

module.exports = mongoose.model('classiques', Classique)