const router = require('express').Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user.id });
    res.json(order);
  } catch (e) { res.status(500).json({ message: 'Error placing order' }); }
});

router.get('/my', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get('/all', auth, async (req, res) => {
  const orders = await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 });
  res.json(orders);
});

router.put('/:id/status', auth, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(order);
});

module.exports = router;