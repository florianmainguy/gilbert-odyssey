const mongoose = require('mongoose')

mongoose
    .connect('mongodb://127.0.0.1:27017/course-cycliste', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

db.once('open', function () {
    console.log("Connection to DB OK")
})

module.exports = db