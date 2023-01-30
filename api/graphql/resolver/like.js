const Like = require('../../model/like');
const User = require('../../model/user');
const Photo = require('../../model/photo');
const Comment = require('../../model/comment');

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
      const itemType = args.likeInput.type;
      let findItem;
      let like;
      if (itemType === 'photo') {
        findItem = await Photo.findById(args.likeInput.itemId);
      } else if (itemType === 'comment') {
        findItem = await Comment.findById(args.likeInput.itemId);
      } else {
        throw new Error('Invalid "type" name!');
      }
      if (!findItem) {
        throw new Error(`${itemType} not found!`);
      }
      like = new Like({
        photo: itemType === 'photo' ? findItem._doc._id : null,
        comment: itemType === 'comment' ? findItem._doc._id : null,
        user: findUser._doc._id
      });
      await like.save().then(async (response) => {
        if (itemType === 'photo') {
          await Photo.findOneAndUpdate(
            {_id: findItem._doc._id},
            {
              $push: {
                likes: response._doc._id
              }
            },
            {upsert: true}
          );
        } else if (itemType === 'comment') {
          await Comment.findOneAndUpdate(
            {_id: findItem._doc._id},
            {
              $push: {
                likes: response._doc._id
              }
            },
            {upsert: true}
          );
        }
        return response;
      });
      return transformLike(findItem);
    } catch (error) {
      throw error;
    }
  },
  dislike: async (args, req) => {
    if (!req.user) {
      throw new Error('Unauthorize user!');
    }
    try {
      const findUser = await User.findById(req.user.id);
      if (!findUser) {
        throw new Error('User not found!');
      }
      const itemType = args.likeInput.type;
      if (itemType !== 'photo' && itemType !== 'comment') {
        throw new Error('Invalid "type" name!');
      }
      const findLike = await Like.findById(args.likeInput.itemId);
      if (!findLike) {
        throw new Error('like data not found!');
      }
      await Like.deleteOne({_id: findLike._doc._id})
        .then(async () => {
          if (itemType === 'photo') {
            await Photo.findOneAndUpdate(
              {_id: findLike._doc.photo},
              {
                $pullAll: {
                  likes: [findLike._doc._id]
                }
              }
            );
          } else if (itemType === 'comment') {
            await Comment.findOneAndUpdate(
              {_id: findLike._doc.comment},
              {
                $pullAll: {
                  likes: [findLike._doc._id]
                }
              }
            )
          }
        });
      return transformLike(findLike);
    } catch (error) {
      throw error;
    }
  }
}