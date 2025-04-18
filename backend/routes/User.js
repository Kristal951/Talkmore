const express = require('express')
const { SignUpUser, LoginUser , SearchUser, createGoogleUser, loginUserWithGoogle} = require('../controllers/User')

const router = express.Router()

router.post('/SignUp', SignUpUser)
router.post('/Login', LoginUser)
router.post('/searchUser', SearchUser)
router.post('/googleSignUp', createGoogleUser)
router.post('/googleSignIn', loginUserWithGoogle)

module.exports = router