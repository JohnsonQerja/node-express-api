const express = require('express');
const route = express.Router();
const verifyToken = require('../middleware/verify-token');

const ControllerComment = require('../controller/comment');

route.post('/', verifyToken, ControllerComment.comment_post);

route.get('/:photoId', ControllerComment.comments_get);

route.post('/reply', verifyToken, ControllerComment.reply_post);

module.exports = route;