const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  imageUrl: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'Like'}
  ],
  created_at: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Photo', photoSchema);