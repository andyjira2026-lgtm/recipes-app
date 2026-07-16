const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  category:     { type: String, required: true },
  subCategory:  { type: String, default: '' },
  picture:      { type: String, default: null },
  ingredients:  [{ type: String }],
  instructions: [{ type: String }],
  submittedBy:  { type: String, required: true },
  submitterPic: { type: String, default: null },
  submittedAt:  { type: Date, default: Date.now },
});

// Expose _id as id in JSON responses
recipeSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

module.exports = mongoose.model('Recipe', recipeSchema);
