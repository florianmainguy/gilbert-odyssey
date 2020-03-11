const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./database')
const classiqueRouter = require('./routes/classique-router')
const cyclistRouter = require('./routes/cyclist-router')
const proxy = require('http-proxy-middleware')
const app = express()
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api', classiqueRouter)
app.use('/api', cyclistRouter)

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = function(app) {
    // add other server routes to path array
    app.use(proxy(['/api' ], { target: 'http://localhost:5000' }));
}
