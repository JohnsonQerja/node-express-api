const Comment = require('../../model/comment');
const Photo = require('../../model/photo');
// const {} = require('./merge');

module.exports = {
  comments: async args => {
    try {
      console.log('query comment by thread id')
      const comments = await Comment.find({thread: args.photoId});
      return comments.map(comment => {
        return {
          ...comment._doc,
        }
      })
    } catch (error) {
      throw error;
    }
  },
  addComment: async (args, req) => {
    if (!req.user) {
      throw new Error('Unauthorize user!');
    }
    try {
      const findPhoto = await Photo.findById(args.addCommentInput.photoId);
      if (!findPhoto) {
        throw new Error('Photo not found!');
      }
      const comment = new Comment({
        message: args.addCommentInput.message,
        photo: findPhoto._doc._id,
        user: req.user.id
      });
      const result = await comment.save();
      return {
        ...result._doc,
      }
    } catch (error) {
      throw error;
    }
  },
  replyComment: async (args, req) => {
    if (!req.user) {
      throw new Error('Unauthorize user!');
    }
    try {
      const findThread = await Comment.findById(args.replyCommentInput.threadId);
      if (!findThread) {
        throw new Error('Threade not found!');
      }
      const reply = new Comment({
        message: args.replyCommentInput.message,
        thread: findThread._doc._id,
        user: req.user.id
      });
      let result = await reply.save().then(async res => {
        await Comment.findOneAndUpdate(
          {_id: findThread._doc._id},
          {
            $push: {
              reply: {
                _id: res._id,
                message: res.message,
                user: {
                  _id: req.user.id,
                  name: req.user.name,
                }
              }
            }
          },
          {upsert: true}
        );
        return res;
      })
      console.log(result);
      return {
        ...result._doc,
      }
    } catch (error) {
      throw error;
    }
  }
}