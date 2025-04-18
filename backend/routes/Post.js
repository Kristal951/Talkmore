const express = require('express')
const { fetchPosts , Search} = require('../controllers/FetchPosts')

const router = express.Router()

router.get('/getPosts', fetchPosts)
router.post('/searchPost', Search)

module.exports = router