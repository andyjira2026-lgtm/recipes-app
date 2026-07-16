const express     = require('express');
const Recipe      = require('../models/Recipe');
const User        = require('../models/User');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// GET /api/recipes
router.get('/', verifyToken, async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ submittedAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/recipes
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, category, subCategory, picture, ingredients, instructions } = req.body;

    // Snapshot submitter's current pic for sidebar display
    const submitterUser = await User.findOne({ username: req.user.username }).select('pic');
    const submitterPic  = submitterUser ? submitterUser.pic : null;

    const recipe = await Recipe.create({
      title,
      category,
      subCategory: subCategory || '',
      picture:     picture || null,
      ingredients:  Array.isArray(ingredients)  ? ingredients  : [],
      instructions: Array.isArray(instructions) ? instructions : [],
      submittedBy:  req.user.username,
      submitterPic,
    });

    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/recipes/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
