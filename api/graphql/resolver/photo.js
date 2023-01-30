const Photo = require('../../model/photo');
const User = require('../../model/user');

const { transformPhoto } = require('./merge');

module.exports = {
  photos: async (args, req) => {
    try {
      const filter = req.user ? { user: { $ne: req.user.id } } : null;
      const total = await Photo.countDocuments(filter);
      const photos = await Photo.find(filter)
        .skip(args.skip || 0)
        .limit(args.limit || 10)
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
  }
}