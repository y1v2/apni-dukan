const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, default: 'user' }
}, { timestamps: true });
module.exports = mongoose.model('User', schema);