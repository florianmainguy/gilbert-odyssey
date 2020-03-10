const express = require('express')

const CyclistController = require('../controllers/cyclist-controller')

const router = express.Router()

router.get('/cyclists/:cyclist', CyclistController.getCyclistByName)
router.get('/cyclists', CyclistController.getCyclists)

module.exports = router