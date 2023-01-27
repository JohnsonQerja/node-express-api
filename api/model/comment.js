const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
  reply: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    }
  ],
});

module.exports = mongoose.model('Comment', CommentSchema);