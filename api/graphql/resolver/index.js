const AuthResolver = require('./auth');
const PhotoResolver = require('./photo');
const LikeResolver = require('./like');

const RootResolver = {
  ...AuthResolver,
  ...PhotoResolver,
  ...LikeResolver,
}

module.exports = RootResolver;