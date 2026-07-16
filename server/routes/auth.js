const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');

const router = express.Router();

function makeToken(user) {
  return jwt.sign(
    { _id: user._id.toString(), username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function userPayload(user) {
  return {
    username:  user.username,
    firstName: user.firstName,
    lastName:  user.lastName,
    email:     user.email,
    location:  user.location,
    pic:       user.pic,
  };
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, location, pic } = req.body;

    if (!firstName || !lastName || !username || !email || !password || !location) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: 'Username already taken.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName, lastName, username, email, location,
      password: hashed,
      pic: pic || null,
    });

    res.status(201).json({ token: makeToken(user), user: userPayload(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Username not found. Please register first.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    res.json({ token: makeToken(user), user: userPayload(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
