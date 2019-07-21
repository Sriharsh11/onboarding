const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  time: {
      type: String,
      required: true
  }
});

const Mentor = mongoose.model('Mentor', UserSchema);

module.exports = Mentor;
