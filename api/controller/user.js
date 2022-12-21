const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validation_signup, validation_signin } = require('../utils/validation');

const User = require("../model/user");

module.exports.user_signup = async (req, res, next) => {
  const { error } = validation_signup(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message});
  }
  const checkEmail = await User.findOne({ email: req.body.email });
  if (checkEmail) {
    return res.status(409).json({ message: "Email already in used" });
  }

  bcrypt.hash(req.body.password, 10, async (error, hash) => {
    if (error) {
      return res.status(500).json({ message: error });
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });

      user
        .save()
        .then((response) => {
          res.status(201).json({
            data: {
              _id: response._id,
              name: response.name,
              email: response.email,
              password: response.password,
            },
          });
        })
        .catch((error) => {
          res.status(400).json({ message: error.message });
        });
    }
  });
};

module.exports.user_signin = async (req, res, next) => {
  const { error } = validation_signin(req.body);
  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }
  const account = await User.findOne({ email: req.body.email });
  if (!account) {
    return res.status(401).json({ message: "Email not found" });
  }
  bcrypt.compare(req.body.password, account.password, (err, result) => {
    if (err) return res.status(401).json({ message: "Auth failed" });
    if (!result) res.status(401).json({ message: "Invalid password" });
  });
  const token = jwt.sign({ _id: account._id }, process.env.SECRET_TOKEN, { expiresIn: "1h" });
  res
    .status(200)
    .header("Authorization")
    .json({
      data: {
        user: {
          _id: account._id,
          name: account.name,
          email: account.email,
        },
        token: token,
      },
    });
};

module.exports.user_delete = async (req, res, next) => {
  User.remove({ _id: req.params.id })
    .then((response) => {
      if (response.deletedCount < 1) {
        return res
          .status(400)
          .json({ message: `User with id: ${req.params.id} not found!` });
      }
      res.status(200).json({ message: "Success delete user" });
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
};
