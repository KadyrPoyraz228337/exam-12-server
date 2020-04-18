const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  token: String,
  facebookId: String,
  avatarImage: String
});

module.exports = mongoose.model('User', UserSchema);