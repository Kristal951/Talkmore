const express = require('express')
const { SignUpUser, LoginUser , SearchUser} = require('../controllers/User')

const router = express.Router()

router.post('/SignUp', SignUpUser)
router.post('/Login', LoginUser)
router.post('/searchUser', SearchUser)

module.exports = router