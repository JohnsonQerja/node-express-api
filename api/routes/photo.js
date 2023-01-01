const express = require('express');
const route = express.Router();
const verifyToken = require('../middleware/verify-token');

const PhotoController = require('../controller/photo');

route.get('/', PhotoController.photo_get_all);

route.get('/:id', PhotoController.photo_get_one);

route.get('/user/:userId', PhotoController.photo_get_by_user);

route.post('/', verifyToken, PhotoController.photo_create);

route.delete('/:id', verifyToken, PhotoController.photo_delete);

route.patch('/:id', verifyToken, PhotoController.photo_patch);

module.exports = route;