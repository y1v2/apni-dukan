const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ name: String, price: Number, qty: Number }],
  total: Number,
  address: { street: String, city: String, pincode: String, phone: String },
  status: { type: String, default: 'Placed', enum: ['Placed','Packed','Out for Delivery','Delivered'] }
}, { timestamps: true });
module.exports = mongoose.model('Order', schema);