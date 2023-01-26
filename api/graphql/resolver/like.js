const Like = require('../../model/like');
const User = require('../../model/user');
const Photo = require('../../model/photo');

const { transformLike } = require('./merge');

module.exports = {
  like: async (args, req) => {
    if (!req.user) {
      throw new Error('Unauthorize user!');
    }
    try {
      const findUser = await User.findById(req.user.id);
      if (!findUser) {
        throw new Error('User not found!');
      }
      const findPhoto = await Photo.findById(args.photoId);
      if (!findPhoto) {
        throw new Error('Photo not found!');
      }
      const like = new Like({
        photo: findPhoto._doc._id,
        user: findUser._doc._id
      });
      const result = await like.save();
      return transformLike(result);
    } catch (error) {
      throw error;
    }
  },
  unlike: async (args, req) => {
    if (!req.user) {
      throw new Error('Unauthorize user!');
    }
    try {
      const findUser = await User.findById(req.user.id);
      if (!findUser) {
        throw new Error('User not found!');
      }
      const findLike = await Like.findById(args.likeId);
      if (!findLike) {
        throw new Error('like data not found!');
      }
      await Like.deleteOne({_id: findLike._doc._id});
      return transformLike(findLike);
    } catch (error) {
      throw error;
    }
  }
}