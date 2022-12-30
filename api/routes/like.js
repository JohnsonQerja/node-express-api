const express = require('express');
const route = express.Router();
const verifyToken = require('../middleware/verify-token');

const LikeController = require('../controller/like');

route.post('/', verifyToken, LikeController.like_post);

route.get('/:photoId', LikeController.like_get_by_post);

route.delete('/:id', verifyToken, LikeController.like_remove);


module.exports = route;