const AuthResolver = require('./auth');
const PhotoResolver = require('./photo');
const LikeResolver = require('./like');
// const CommentResolver = require('./comment');

const RootResolver = {
  ...AuthResolver,
  ...PhotoResolver,
  ...LikeResolver,
  // ...CommentResolver,
}

module.exports = RootResolver;