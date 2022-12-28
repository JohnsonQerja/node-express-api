const joi = require('joi');

module.exports.validation_signup = (data) => {
  const schema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6),
  });

  return schema.validate(data);
}

module.exports.validation_signin = (data) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string(),
  });

  return schema.validate(data);
}

module.exports.validation_post = (data) => {
  
}