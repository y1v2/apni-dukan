const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email aur password zaruri hai' });
    if (password.length < 6) return res.status(400).json({ message: 'Password 6+ characters ka hona chahiye' });
    if (!age || age < 13) return res.status(400).json({ message: 'Age 13+ hona chahiye' });
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) return res.status(400).json({ message: 'Yeh email pehle se registered hai. Login karo.' });
    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) return res.status(400).json({ message: 'Yeh phone number pehle se registered hai.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed, phone, age: parseInt(age) });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email, phone: user.phone, age: user.age, role: user.role } });
  } catch (e) { res.status(500).json({ message: 'Server error: ' + e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email aur password bharo' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Yeh email registered nahi hai. Signup karo.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Galat password!' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email, phone: user.phone, age: user.age, role: user.role } });
  } catch (e) { res.status(500).json({ message: 'Server error: ' + e.message }); }
});

// Check if contact (phone/email) is registered before sending OTP
router.post('/check-contact', async (req, res) => {
  try {
    const { type, contact } = req.body;
    let user;
    if (type === 'phone') {
      user = await User.findOne({ phone: contact });
    } else {
      user = await User.findOne({ email: contact.toLowerCase() });
    }
    if (!user) return res.status(404).json({ message: type === 'phone' ? 'Yeh phone number registered nahi hai. Pehle signup karo.' : 'Yeh email registered nahi hai. Pehle signup karo.' });
    res.json({ success: true, message: 'Contact verified' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Reset password after OTP verification
router.post('/reset-password', async (req, res) => {
  try {
    const { type, contact, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: 'Password 6+ characters ka hona chahiye' });
    const query = type === 'phone' ? { phone: contact } : { email: contact.toLowerCase() };
    const hashed = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate(query, { password: hashed }, { new: true });
    if (!user) return res.status(404).json({ message: 'User nahi mila' });
    res.json({ success: true, message: 'Password reset ho gaya!' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({}, 'name email phone age createdAt role').sort({ createdAt: -1 });
    res.json(users);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;