const express = require('express');
const route = express.Router();
const verifyToken = require('../middleware/verify-token');

const OrderController = require('../controller/order');

// get all
route.get('/', verifyToken, OrderController.order_get_all);

// post order
route.post('/', verifyToken, OrderController.order_create);

// get order by Id
route.get('/:id', verifyToken, OrderController.order_get_one);

// delete order by Id
route.delete('/:id', verifyToken, OrderController.order_delete);

module.exports = route;