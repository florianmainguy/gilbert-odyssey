const express = require('express')

const ClassiqueCtrl = require('../controllers/classique-ctrl')

const router = express.Router()

router.get('/classiques/:name', ClassiqueCtrl.getClassique)
router.get('/classiques', ClassiqueCtrl.getClassiques)

module.exports = router