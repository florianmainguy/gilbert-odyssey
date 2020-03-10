const mongoose = require('mongoose')

//TODO => hide password
const password = 'xWaxbKSJhFU5MD8T';

mongoose
    .connect(`mongodb+srv://Chienchien:xWaxbKSJhFU5MD8T@cluster0-3g216.mongodb.net/gilbert-odyssey?retryWrites=true&w=majority`)
    .then(() => {
        console.log("Database connection successful")  
    })
    .catch(err => {
        console.error('Database connection error', err.message)
    })
    
const db = mongoose.connection

module.exports = db