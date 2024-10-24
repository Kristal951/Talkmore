const express = require('express')
const { createToken } = require('../controllers/Stream')

const router = express.Router()

router.post('/token', createToken)

module.exports = router