const express     = require('express');
const User        = require('../models/User');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// GET /api/users/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      username:  user.username,
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      location:  user.location,
      pic:       user.pic,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/me/pic
router.put('/me/pic', verifyToken, async (req, res) => {
  try {
    const { pic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { pic: pic || null },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ pic: user.pic });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
