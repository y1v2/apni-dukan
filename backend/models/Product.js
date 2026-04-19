const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  nameHindi: String,
  price: { type: Number, required: true },
  mrp: { type: Number },
  discount: { type: Number, default: 0 },
  quantity: String,
  category: String,
  stock: { type: Number, default: 100 },
  lowStockAlert: { type: Number, default: 10 },
  image: String,
  badge: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Product', schema);