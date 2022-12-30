const mongoose = require('mongoose');

const Like = require('../model/like');
const User = require('../model/user');
const Photo = require('../model/photo');

module.exports.like_post = async (req, res, next) => {
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
  const like = new Like({
    _id: new mongoose.Types.ObjectId(),
    photo: photoId,
    user: userId,
  });
  await like
    .save()
    .then(async (response) => {
      await Photo.findOneAndUpdate({ _id: photoId }, { $push: { likes: response._id } }, { upsert: true });
      res.status(201).json({
        status: 201,
        data: {
          _id: response._id,
          photo: response.photo,
          user: response.user,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({message: error.message});
    })
};

module.exports.like_get_by_post = async (req, res, next) => {
  const photoId = req.params.photoId;
  if (!photoId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({message: 'Photo ID not valid'});
  }
  await Like.find({photo: photoId})
    .select('_id user')
    .populate('user', '_id name')
    .then((response) => {
      if (!response) {
        return res.status(404).json({message: `Photo with id: ${photoId} not found`});
      }
      res.status(200).json({data: response});
    })
    .catch((error) => {
      res.status(500).json({message: error.message});
    })
};

module.exports.like_remove = async (req, res, next) => {
  const likeId = req.params.id;
  if (!likeId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({message: 'Like ID not valid'});
  }
  const likeData = await Like.findById({_id: likeId});
  if (!likeData) {
    return res.status(404).json({message: `Like with id: ${likeData} not found`});
  }
  const matchOwner = await Like.findOne({_id: likeId, user: req.user._id});
  if (!matchOwner) {
    return res.status(401).json({message: 'Unauthorize user'});
  }
  await Like.deleteOne({_id: likeId})
    .then(async (response) => {
      await Photo.findByIdAndUpdate({ _id: likeData.photo }, { $pullAll: { likes: [likeId] } });
      res.status(200).json({message: 'remove like success'});
    })
    .catch((error) => {
      res.status(400).json({message: error.message});
    })
};