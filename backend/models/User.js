const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true },
  age: { type: Number, min: 13, max: 120 },
  bio: String,
  city: String,
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('User', schema);