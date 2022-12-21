const express = require('express');
const route = express.Router();
const verifyToken = require('../middleware/verify-token');

const userController = require('../controller/user');

// register user
route.post('/signup', userController.user_signup);

// login user
route.post('/signin', userController.user_signin);

// delete user by Id
route.delete('/delete/:id', verifyToken, userController.user_delete);

module.exports = route;