const mongoose = require('mongoose');
const { validation_comment, validation_reply } = require('../utils/validation');

const Comment = require('../model/comment');
const Photo = require('../model/photo');
const User = require('../model/user');

module.exports.comment_post = async (req, res) => {
  const { error } = validation_comment(req.body);
  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }
  const photoId = req.body.photo_id;
  if (!photoId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({message: 'Photo Id not valid'});
  }
  const findPhoto = await Photo.findById(photoId);
  if (!findPhoto) {
    res.status(404).json({message: `Photo with id: ${photoId} not found!`});
  }
  const userId = req.user._id;
  const findUser = await User.findById(userId);
  if (!findUser) {
    res.status(404).json({message: `User with id: ${userId} not found!`});
  }
  const comment = new Comment({
    _id: new mongoose.Types.ObjectId(),
    message: req.body.message,
    photo: photoId,
    user: userId,
  });
  await comment
    .save()
    .then(response => {
      res.status(201).json({
        status: 201,
        data: {
          _id: response._id,
          message: response.message,
          photo: response.photo,
          user: {
            _id: findUser._id,
            name: findUser.name,
          },
        },
      })
    })
    .catch(error => {
      res.status(400).json({message: error.message});
    });
};

module.exports.reply_post = async (req, res) => {
  const { error } = validation_reply(req.body);
  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }
  const threadId= req.body.thread_id;
  if (!threadId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({message: 'Comment ID not valid'});
  }
  const comment = await Comment.findById(threadId);
  if (!comment) {
    return res.status(404).json({message: `Comment with Id: ${threadId} not found`});
  }
  const userId = req.user._id;
  const findUser = await User.findById(userId);
  if (!findUser) {
    res.status(404).json({message: `User with id: ${userId} not found!`});
  }
  const reply = new Comment({
    _id: new mongoose.Types.ObjectId(),
    message: req.body.message,
    thread: threadId,
    user: userId,
  });
  await reply
    .save()
    .then(async response => {
      await Comment.findOneAndUpdate(
        {_id: threadId},
        {
          $push: {
            reply: {
              _id: response._id,
              message: response.message,
              user: {
                _id: findUser._id,
                name: findUser.name,
              },
            }
          },
        },
        {upsert: true}
      );
      res.status(201).json({status: 201, data: {
        _id: response._id,
        message: response.message,
        thread: response.thread,
        user: response.user,
      }});
    })
    .catch(error => {
      res.status(400).json({message: error.message});
    })
};

module.exports.comments_get = async (req, res) => {
  const photoId = req.params.photoId;
  if (!photoId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({message: 'Photo ID not valid'});
  }
  await Comment.find({photo: photoId})
    .select('_id message reply photo user')
    .populate('user', '_id name')
    .then(response => {
      res.status(200).json({data: response});
    })
    .catch(error => {
      res.status(500).json({message: error.message});
    })
};