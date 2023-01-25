const DataLoader = require('dataloader');

const Photo = require('../../model/photo');
const User = require('../../model/user');
const Like = require('../../model/like');

const likesLoader = new DataLoader(photosId => {
  return likes(photosId);
});

const photo = async photoId => {
  try {
    const photo = await Photo.findById(photoId.toString());
    return photo;
  } catch (error) {
    throw error;
  }
}

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
        ...like._doc,
        photo: photo.bind(this, like._doc.photo),
        user: user.bind(this, like._doc.user)
      }
    })
  } catch (error) {
    throw error;
  }
}

const transformPhoto = photo => {
  return {
    ...photo._doc,
    user: user.bind(this, photo._doc.user),
    likes: likes.bind(this, photo._doc._id),
    created_at: new Date(photo._doc.created_at).toISOString()
  }
};

module.exports = {
  photos: async () => {
    try {
      const photos = await Photo.find().sort({created_at: 'desc'});
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
      const photos = await Photo.find({user: args.userId}).sort({created_at: 'desc'});
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