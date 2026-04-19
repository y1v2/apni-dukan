const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    name: String,
    price: Number,
    mrp: Number,
    qty: Number,
    category: String,
    img: String
  }],
  total: Number,
  deliveryCharge: { type: Number, default: 0 },
  grandTotal: Number,
  address: {
    name: String,
    phone: String,
    street: String,
    city: String,
    pincode: String,
    landmark: String,
    location: { lat: Number, lng: Number }
  },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, default: 'Pending' },
  razorpayPaymentId: String,
  status: { type: String, default: 'Placed', enum: ['Placed','Packed','Out for Delivery','Delivered','Cancelled'] },
  otp: String,
  receiptNumber: String,
}, { timestamps: true });
module.exports = mongoose.model('Order', schema);