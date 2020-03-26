const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
const Router = require('./router');
const proxy = require('http-proxy-middleware');
const port = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', Router);

app.listen(port, () => console.log(`Listening on port ${port}`));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//TODO make heroku creates its own build
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

module.exports = function(app) {
    app.use(proxy(['/api' ], { target: 'http://localhost:5000' }));
}
