const Photo = require('../../model/photo');

const User = require('../../model/user');
const Like = require('../../model/like');

const user = async userId => {
  try {
    const user = await User.findById(userId.toString());
    return user;
  } catch (error) {
    throw error;
  }
}

const likes = async photoId => {
  try {
    const likes = await Like.find({photo: photoId});
    return likes.map(like => {
      return {
        ...like._doc
      }
    })
  } catch (error) {
    throw error;
  }
}

module.exports = {
  photos: async () => {
    try {
      const photos = await Photo.find();
      return photos.map(photo => {
        return {
          ...photo._doc,
          user: user.bind(this, photo._doc.user),
          likes: likes.bind(this, photo._doc._id),
          created_at: new Date(photo._doc.created_at).toISOString()
        }
      })
    } catch (error) {
      throw error
    }
  },
  userPhotos: async args => {
    try {
      const photos = await Photo.find({user: args.userId});
      return photos.map(photo => {
        return {
          ...photo._doc,
          user: user.bind(this, photo._doc.user),
          likes: likes.bind(this, photo._doc._id),
          created_at: new Date(photo._doc.created_at).toISOString()
        }
      })
    } catch (error) {
      throw error;
    }
  }
}