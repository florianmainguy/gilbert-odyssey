const express = require('express')

const ClassiqueController = require('../controllers/classique-controller')

const router = express.Router()

router.post('/classiques', ClassiqueController.createClassique)
router.get('/classiques/:id', ClassiqueController.getClassiqueById)
router.get('/classiques', ClassiqueController.getClassiques)

module.exports = router