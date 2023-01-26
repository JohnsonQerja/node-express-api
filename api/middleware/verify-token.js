const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization') ? req.header('Authorization').split(" ")[1] : null;
  if (!token) {
    // return res.status(401).json({message: 'No token!'});
    req.user = false;
    return next();
  }
  try {
    const verify = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = verify;
    next();
  } catch (error) {
    res.status(401).json({message: 'Unauthorize token!'});
    req.user = false;
    return next();
  }
}