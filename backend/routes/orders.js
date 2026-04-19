const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Generate receipt number
function generateReceipt() {
  const d = new Date();
  return `AD${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}${Math.floor(Math.random()*9000+1000)}`;
}

// Place order
router.post('/', auth, async (req, res) => {
  try {
    const { items, total, address, paymentMethod, paymentStatus, razorpayPaymentId, grandTotal, deliveryCharge } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'Cart khali hai' });
    if (!address?.name || !address?.phone || !address?.street) return res.status(400).json({ message: 'Address pura bharo' });

    const receiptNumber = generateReceipt();

    // Reduce stock
    for (const item of items) {
      await Product.findOneAndUpdate(
        { name: item.name },
        { $inc: { stock: -item.qty } }
      );
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      deliveryCharge: deliveryCharge || 0,
      grandTotal: grandTotal || total,
      address,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentStatus || 'Pending',
      razorpayPaymentId,
      receiptNumber,
      status: 'Placed'
    });

    res.json({ success: true, order, receiptNumber });
  } catch (e) {
    console.error('Order error:', e);
    res.status(500).json({ message: 'Order place karne mein error: ' + e.message });
  }
});

// My orders
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// All orders (admin)
router.get('/all', auth, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Update status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, { new: true });
    // Restore stock
    for (const item of order.items) {
      await Product.findOneAndUpdate({ name: item.name }, { $inc: { stock: item.qty } });
    }
    res.json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;