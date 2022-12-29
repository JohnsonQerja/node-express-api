const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  }
});

module.exports = mongoose.model('Like', likeSchema);