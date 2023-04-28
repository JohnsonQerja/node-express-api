const mongoose = require("mongoose");

const Order = require("../model/order");
const Product = require("../model/product");

module.exports.order_get_all = async (req, res, next) => {
  await Order.find()
    .select("_id product quantity")
    .populate("product", "name")
    .then((response) => {
      res.status(200).json({ data: response });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

module.exports.order_create = async (req, res, next) => {
  const id = req.body.productId;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Product ID not valid!" });
  }
  const findProduct = await Product.findById(req.body.productId);
  if (!findProduct) {
    return res
      .status(404)
      .json({ message: `Product with id: ${req.body.productId} not found!` });
  }
  const newOrder = new Order({
    _id: new mongoose.Types.ObjectId(),
    product: req.body.productId,
    quantity: req.body.quantity,
  });
  await newOrder
    .save()
    .then((response) => {
      res.status(201).json({
        data: {
          _id: response._id,
          product: response.product,
          quantity: response.quantity,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
};

module.exports.order_get_one = async (req, res, next) => {
  await Order.findById(req.params.id)
    .select("_id product quantity")
    .populate("product", "name price")
    .then((response) => {
      if (response === null) {
        return res
          .status(404)
          .json({ message: `Order with Id: ${req.params.id} not found!` });
      }
      res.status(200).json({ data: response });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

module.exports.order_delete = async (req, res, next) => {
  await Order.remove({ _id: req.params.id })
    .then((response) => {
      // console.log(response);
      if (response.deletedCount < 1) {
        return res
          .status(404)
          .json({ message: `Order with id: ${req.params.id} not found!` });
      }
      res.status(200).json({ message: "Order delete successfully!" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};
