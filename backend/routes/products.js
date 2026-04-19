const router = require('express').Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/all', auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id/stock', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { stock: req.body.stock }, { new: true });
    res.json(product);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;