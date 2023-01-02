const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  message: {
    type: String,
    required: true,
  },
  reply: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}
  ],
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

module.exports = mongoose.model('Comment', CommentSchema);