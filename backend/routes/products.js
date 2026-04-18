const router = require('express').Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post('/', auth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (e) { res.status(500).json({ message: 'Error adding product' }); }
});

router.delete('/:id', auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;