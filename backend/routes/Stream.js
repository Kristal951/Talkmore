const express = require('express')
const { createToken , updateUser} = require('../controllers/Stream')

const router = express.Router()

router.post('/token', createToken)
router.post('/updateUser', updateUser)

module.exports = router