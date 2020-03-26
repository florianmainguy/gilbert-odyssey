const express = require('express');
const Controller = require('./controller');
const router = express.Router();

router.get('/all', Controller.getClassiquesAndCyclists);

module.exports = router;