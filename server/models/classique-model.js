const mongoose = require('mongoose')

const Classique = new mongoose.Schema({
    name: String,
    location: {
        type: {
            type: String,
            enum: ['LineString'],
            required: true
        },
        coordinates: {
            type: [[Number]],
            required: true
        }
    }
});

module.exports = mongoose.model('classiques', Classique)