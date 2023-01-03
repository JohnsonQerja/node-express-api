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

module.exports.validation_photo = (data) => {
  const schema = joi.object({
    imageUrl: joi.string().required(),
    caption: joi.string().required(),
  });

  return schema.validate(data);
}

module.exports.validation_comment = (data) => {
  const schema = joi.object({
    message: joi.string().required(),
    photo_id: joi.string().required(),
  });

  return schema.validate(data);
}

module.exports.validation_reply = (data) => {
  const schema = joi.object({
    thread_id: joi.string().required(),
    message: joi.string().required(),
  });

  return schema.validate(data);
}