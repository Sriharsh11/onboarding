const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const secret = require('./config/secret.js');

const app = express();

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

const db = secret.mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


app.use('/', require('./routes/users.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));