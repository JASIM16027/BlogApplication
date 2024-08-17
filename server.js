const express = require('express');
const userRoutes = require('./routes/user.routes');
const blogRoutes = require('./routes/post.routes'); 
const commentRoutes = require('./routes/comment.routes');
const dbConnection = require('./dbConfig/database.config');
require('dotenv').config()
const app = express();
//----------------- Middleware to parse JSON bodies------------------------
app.use(express.json());

//-------------------- Connect to MongoDB----------------------------------
dbConnection();

//-------------------- Root route-------------------------------------------
app.get('/', (req, res) => {
    res.send('Welcome to the RESTful API');
  });
// ---------------------Define routes---------------------------------------


app.use('/api/users', userRoutes);
app.use('/api', blogRoutes);
app.use('/api', commentRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
