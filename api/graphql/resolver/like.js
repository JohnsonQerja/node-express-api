const Like = require('../../model/like');
const Photo = require('../../model/photo');
const User = require('../../model/user');

const photo = async photoId => {
  console.log('query photo');
  try {
    const photo = await Photo.findById(photoId);
    return {
      ...photo._doc,
    }
  } catch (error) {
    throw error;
  }
};

const user = async userId => {
  console.log('query user');
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
    }
  } catch (error) {
    throw error;
  }
}

const transformLike = like => {
  return {
    ...like._doc,
    photo: photo.bind(this, like.photo),
    user: user.bind(this, like.user),
  }
}

module.exports = {
  likes: async args => {
    try {
      const likes = await Like.find({photo: args.photoId});
      return likes.map(like => {
        return transformLike(like);
      })
    } catch (error) {
      throw error;
    }
  }
}