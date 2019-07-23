const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const secret = require('./config/secret.js');
const userRoutes = require('./routes/users.js');
// const initializeRoutes = require('./routes/users.js');

const app = express();



app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use('/',require('./routes/users.js'));
app.use('/',require('./routes/mentors.js'));
app.use('/',require('./routes/slots.js'));

const db = secret.mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// initializeRoutes(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));