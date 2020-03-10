const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./database')
const classiqueRouter = require('./routes/classique-router')
const cyclistRouter = require('./routes/cyclist-router')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.use('/api', classiqueRouter)
app.use('/api', cyclistRouter)

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${apiPort}`))