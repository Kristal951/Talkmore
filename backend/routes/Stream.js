const express = require('express')
const { createToken , updateUser, searchChannels} = require('../controllers/Stream')

const router = express.Router()

router.post('/token', createToken)
router.post('/updateUser', updateUser)
router.post('/searchChannels', searchChannels)

module.exports = router