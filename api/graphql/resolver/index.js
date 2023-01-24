const AuthResolver = require('./auth');
const PhotoResolver = require('./photo');

const RootResolver = {
  ...AuthResolver,
  ...PhotoResolver,
}

module.exports = RootResolver;