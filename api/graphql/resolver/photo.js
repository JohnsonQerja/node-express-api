const Photo = require('../../model/photo');
const User = require('../../model/user');

const { transformPhoto } = require('./merge');

module.exports = {
  photos: async (args, req) => {
    try {
      // const filter = req.user ? { user: { $ne: req.user.id } } : args.exclude ? { _id: { $ne: args.exclude } } : null;
      const filter = { user: { $ne: req.user ? req.user.id : null }, _id: { $ne: args.exclude || null } };
      const total = await Photo.countDocuments(filter);
      const photos = await Photo.find(filter)
        .skip(args.skip || 0)
        .limit(args.limit || null)
        .sort({created_at: 'desc'});
      const result = photos.map(photo => {
        return transformPhoto(photo);
      });
      return {
        data: [...result],
        total
      };
    } catch (error) {
      throw error
    }
  },
  userPhotos: async args => {
    try {
      const total = await Photo.countDocuments({user: args.userId});
      const photos = await Photo.find({user: args.userId})
        .skip(args.skip || 0)
        .limit(args.limit || 10)
        .sort({created_at: 'desc'});
      const result = photos.map(photo => {
        return transformPhoto(photo);
      });
      return {
        data: [...result],
        total
      }
    } catch (error) {
      throw error;
    }
  },
  photo: async args => {
    try {
      const data = await Photo.findById(args.photoId);
      return transformPhoto(data);
    } catch (error) {
      throw error;
    }
  },
  post: async (args, req) => {
    if (!req.user) {
      throw new Error('Unauthorize user!');
    }
    try {
      const findUser = await User.findById(req.user.id);
      if (!findUser) {
        throw new Error('User not found!')
      }
      const post = new Photo({
        imageUrl: args.postInput.imageUrl,
        caption: args.postInput.caption,
        user: findUser._doc._id,
      });
      const result = await post.save();
      return transformPhoto(result);
    } catch (error) {
      throw error;
    }
  },
  updatePost: async (args, req) => {
    if (!req.user) {
      throw new Error('Unauthorize user!');
    }
    try {
      const findUser = await User.findById(req.user.id);
      if (!findUser) {
        throw new Error('User not found!');
      }
      const matchOwner = await Photo.findOne({_id: args.updatePostInput.photoId, user: findUser._doc._id});
      if (!matchOwner) {
        throw new Error('Can not edit what is not yours!');
      }
      const result = await Photo.findOneAndUpdate(
        {_id: args.updatePostInput.photoId},
        {$set: {caption: args.updatePostInput.caption}},
        {new: true}
      );
      return transformPhoto(result);
    } catch (error) {
      throw (error);
    }
  },
  deletePost: async (args, req) => {
    if (!req.user) {
      throw new Error('Unauthorize user!');
    }
    try {
      const findUser = await User.findById(req.user.id);
      if (!findUser) {
        throw new Error('User not found!');
      }
      const matchOwner = await Photo.findOne({_id: args.photoId, user: findUser._doc._id});
      if (!matchOwner) {
        throw new Error('Can not delete what is not yours!');
      }
      await Photo.deleteOne({_id: args.photoId});
      return transformPhoto(matchOwner);
    } catch (error) {
      throw (error);
    }
  }
}