const DataLoader = require('dataloader');
const { groupBy, map } = require('ramda');

const Photo = require('../../model/photo');
const User = require('../../model/user');
const Like = require('../../model/like');

const likesLoader = new DataLoader(photosId => {
  return likes(photosId);
});

const usersLoader = new DataLoader(usersId => {
  return users(usersId);
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
    // console.log('query user');
    const user = await User.findById(userId.toString());
    return {
      ...user._doc,
      password: null,
    };
  } catch (error) {
    throw error;
  }
}

const users = async usersId => {
  try {
    // console.log('query users');
    const users = await User.find({_id: {$in: usersId}});
    return users.map(user => {
      return {
        ...user._doc,
        password: null,
      }
    });
  } catch (error) {
    throw error;
  }
}

const likes = async photosId => {
  try {
    // console.log('query likes');
    const likes = await Like.find({photo: { $in: photosId }});
    const groupByPhotoId = groupBy(like => like.photo, likes);
    return map(photoId => {
      if (groupByPhotoId[photoId]) {
        return map(like => {
          return {
            ...like,
            _id: like.id,
            photo: photo.bind(this, like.photo),
            user: user.bind(this, like.user)
          }
        }, groupByPhotoId[photoId])
      }
    } , photosId);
  } catch (error) {
    throw error;
  }
}

// const likes = async photosId => {
//   try {
//     console.log('query likes');
//     const likes = await Like.find({photo: { $in: photosId }});
//     return likes.map(like => {
//       return {
//         ...like._doc,
//         photo: photo.bind(this, like._doc.photo),
//         user: user.bind(this, like._doc.user)
//       }
//     })
//   } catch (error) {
//     throw error;
//   }
// }

const transformPhoto = async photo => {
  return {
    ...photo._doc,
    // user: user.bind(this, photo._doc.user),
    user: usersLoader.load(photo._doc.user.toString()),
    // likes: likes.bind(this, photo._doc._id),
    likes: likesLoader.load(photo._doc._id.toString()),
    created_at: new Date(photo._doc.created_at).toISOString()
  }
};

module.exports = {
  photos: async () => {
    try {
      const photos = await Photo.find().sort({created_at: 'desc'});
      return photos.map(photo => {
        return transformPhoto(photo);
      })
    } catch (error) {
      throw error
    }
  },
  userPhotos: async args => {
    try {
      const photos = await Photo.find({user: args.userId}).sort({created_at: 'desc'});
      return photos.map(photo => {
        return transformPhoto(photo);
      })
    } catch (error) {
      throw error;
    }
  }
}