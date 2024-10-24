const express = require('express');
const userRoutes = require('./routes/User.js');
const streamRoutes = require('./routes/Stream.js');
const postRoutes = require('./routes/Post.js');
const cors = require('cors');

const app = express();
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, 
  allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));

// Define your routes after applying CORS
app.use('/user', userRoutes);
app.use('/stream', streamRoutes);
app.use('/post', postRoutes);

app.listen(5000, () => {
  console.log('server started on port 5000');
});
