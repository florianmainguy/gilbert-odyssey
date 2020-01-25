const mongoose = require('mongoose')

/*mongoose
    .connect('mongodb://127.0.0.1:27017/course-cycliste', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })*/

const password = 'xWaxbKSJhFU5MD8T';

mongoose
    .connect(`mongodb+srv://Chienchien:xWaxbKSJhFU5MD8T@cluster0-3g216.mongodb.net/gilbert-odyssey?retryWrites=true&w=majority`)
    .catch(e => {
        console.error('Connection error', e.message)
    })
    
const db = mongoose.connection

db.once('open', function () {
    console.log("Connection to DB OK")
})

module.exports = db