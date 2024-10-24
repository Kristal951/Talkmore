const express = require('express')
const { fetchPosts } = require('../controllers/FetchPosts')

const router = express.Router()

router.get('/getPosts', fetchPosts)

module.exports = router