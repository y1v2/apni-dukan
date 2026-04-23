const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

function generateReceipt() {
  return 'AD' + new Date().getFullYear() + String(new Date().getMonth()+1).padStart(2,'0') + String(new Date().getDate()).padStart(2,'0') + Math.floor(Math.random()*9000+1000);
}

router.post('/', auth, async (req, res) => {
  try {
    const { items, total, address, paymentMethod, paymentStatus, razorpayPaymentId, grandTotal, deliveryCharge, couponDiscount, walletDiscount } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'Cart khali hai' });
    const receiptNumber = generateReceipt();
    for (const item of items) {
      await Product.findOneAndUpdate({ name: item.name }, { $inc: { stock: -item.qty } });
    }
    const order = await Order.create({
      user: req.user.id, items, total, grandTotal: grandTotal || total, deliveryCharge: deliveryCharge || 0,
      couponDiscount: couponDiscount || 0, walletDiscount: walletDiscount || 0,
      address, paymentMethod: paymentMethod || 'COD', paymentStatus: paymentStatus || 'Pending',
      razorpayPaymentId, receiptNumber, status: 'Placed'
    });
    res.json({ success: true, order, receiptNumber });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Order error: ' + e.message }); }
});

router.get('/my', auth, async (req, res) => {
  try { res.json(await Order.find({ user: req.user.id }).sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/all', auth, async (req, res) => {
  try { res.json(await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id/status', auth, async (req, res) => {
  try {
    const updates = { status: req.body.status };
    if (req.body.status === 'Delivered') updates.paymentStatus = 'Done';
    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id/payment', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus: req.body.paymentStatus }, { new: true });
    res.json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, { new: true });
    for (const item of order.items) {
      await Product.findOneAndUpdate({ name: item.name }, { $inc: { stock: item.qty } });
    }
    res.json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;