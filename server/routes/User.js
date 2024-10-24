const express = require('express')
const { SignUpUser, LoginUser } = require('../controllers/User')

const router = express.Router()

router.post('/SignUp', SignUpUser)
router.post('/Login', LoginUser)

module.exports = router