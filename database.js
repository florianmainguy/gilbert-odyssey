const url = require('./secrets.js');

const mongoose = require('mongoose');

mongoose
    .connect(url)
    .then(() => {
        console.log("Database connection successful")  
    })
    .catch(err => {
        console.error('Database connection error', err.message)
    })
    
const db = mongoose.connection;

module.exports = db;