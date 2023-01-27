const DataLoader = require('dataloader');
const { groupBy, map } = require('ramda');

const User = require('../../model/user');
const Photo = require('../../model/photo');
const Like = require('../../model/like');
const Comment = require('../../model/comment');

const usersLoader = new DataLoader((usersId) => {
  return users(usersId);
});

const photosLoader = new DataLoader((photsId) => {
  return photos(photsId);
});

const likesLoader = new DataLoader((photosId) => {
  return likes(photosId);
});

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return transformUser(user);
  } catch (error) {
    throw error;
  }
}

const users = async usersId => {
  try {
    const users = await User.find({_id: { $in: usersId }});
    return map(user => {
      return transformUser(user);
    }, users);
  } catch (error) {
    throw error;
  }
}

const photo = async photoId => {
  try {
    console.log('query photo');
    const photo = await Photo.findById(photoId);
    return transformPhoto(photo);
  } catch (error) {
    throw error;
  }
}

const photos = async photosId => {
  try {
    const photos = await Photo.find({_id: { $in: photosId }});
    return map(photo => {
      return transformPhoto(photo);
    } , photos);
  } catch (error) {
    throw error;
  }
}

const likes = async photosId => {
  try {
    const likes = await Like.find({photo: { $in: photosId }});
    const groupByPhotoId = groupBy(like => like.photo, likes);
    return map(photoId => {
      if (groupByPhotoId[photoId]) {
        return map(like => {
          return {
            ...like,
            _id: like.id,
            photo: photosLoader.load(like.photo.toString()),
            user: usersLoader.load(like.user.toString())
          }
        }, groupByPhotoId[photoId])
      }
    } , photosId);
  } catch (error) {
    throw error;
  }
}

const transformUser = user => {
  return {
    ...user._doc,
    password: null,
    created_at: new Date(user._doc.created_at).toISOString()
  }
}

const transformPhoto = photo => {
  return {
    ...photo._doc,
    user: usersLoader.load(photo._doc.user.toString()),
    likes: likesLoader.load(photo._doc._id.toString()),
    created_at: new Date(photo._doc.created_at).toISOString()
  }
}

const transformLike = like => {
  return {
    ...like._doc,
    photo: photosLoader.load(like._doc.photo.toString()),
    user: usersLoader.load(like._doc.user.toString())
  }
}

exports.transformUser = transformUser;
exports.transformPhoto = transformPhoto;
exports.transformLike = transformLike;