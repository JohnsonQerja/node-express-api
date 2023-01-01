const mongoose = require('mongoose');

const Photo = require('../model/photo');
const User = require('../model/user');

module.exports.photo_get_all = async (req, res, next) => {
  await Photo.find()
    .sort({created_at: 'desc'})
    .select('_id imageUrl')
    .then((response) => {
      res.status(200).json({
        data: response,
      });
    })
    .catch((error) => {
      res.status(500).json({message: error.message});
    });
};

module.exports.photo_get_one = async (req, res, next) => {
  const id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({message: 'Photo ID not valid'});
  }
  await Photo.findById(id)
    .select('_id imageUrl caption user likes')
    .populate('user', '_id name email')
    .populate({path: 'likes', select: '_id user'})
    .then((response) => {
      if (!response) {
        return res.status(404).json({message: `Photo with id: ${id} not found!`});
      }
      res.status(200).json({data: response});
    })
    .catch((error) => {
      res.status(500).json({message: error.message});
    })
};

module.exports.photo_get_by_user = async (req, res, next) => {
  const userId = req.params.userId;
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({message: 'User ID not valid'});
  }
  await Photo.find({user: userId})
    .sort({created_at: 'desc'})
    .select('_id imageUrl caption likes')
    .populate({path: 'likes', select: '_id user'})
    .then((response) => {
      if (!response) {
        return res.status(404).json({message: `User with id: ${userId} not found!`});
      }
      res.status(200).json({data: response});
    })
    .catch((error) => {
      res.status(500).json({message: error.message});
    })
};

module.exports.photo_create = async (req, res, next) => {
  const userId = req.user._id;
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({message: 'User Id not valid'});
  }
  const findUser = await User.findById(userId);
  if (!findUser) {
    return res.status(404).json({message: `User with id: ${userId} not found!`});
  }
  const photo = new Photo({
    _id: new mongoose.Types.ObjectId(),
    imageUrl: req.body.imageUrl,
    caption: req.body.caption,
    user: req.user._id,
  });
  await photo
    .save()
    .then((response) => {
      res.status(201).json({
        status: 201,
        data: {
          _id: response.id,
          imageUrl: response.imageUrl,
          caption: response.caption,
          user: response.user,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    })
};

module.exports.photo_delete = async (req, res, next) => {
  const id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({message: 'Photo ID not valid!'});
  }
  const userId = req.user._id;
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(401).json({message: 'User ID not valid'});
  }
  const matchOwner = await Photo.findOne({_id: id, user: userId});
  if (!matchOwner) {
    return res.status(401).json({message: 'Unauthorize user'});
  }
  await Photo.deleteOne({_id: req.params.id})
    .then((response) => {
      if (response.deletedCount < 1) {
        res.status(404).json({message: `Photo with id: ${id} not found!`});
      }
      res.status(200).json({status: 200, message: 'Photo delete successfully'});
    })
    .catch((error) => {
      res.status(400).json({message: error.message});
    })
};

module.exports.photo_patch = async (req, res, next) => {
  const updates = req.body;
  await Photo.updateOne({_id: req.params.id}, {$set: updates})
    .then(response => {
      res.status(200).json({status: 200, message: 'Photo update successfully'});
    })
    .catch(error => {
      res.status(400).json({message: error.message});
    })
};