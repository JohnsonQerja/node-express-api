const mongoose = require("mongoose");

const Product = require("../model/product");

module.exports.product_get_all = async (req, res, next) => {
  await Product.find()
    .select("name price _id productImage")
    .then((response) => {
      res.status(200).json({
        data: response,
        count: response.length,
      });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

module.exports.product_create = async (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  await product
    .save()
    .then((response) => {
      res.status(201).json({
        data: {
          _id: response._id,
          name: response.name,
          price: response.price,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
};

module.exports.product_get_by_id = async (req, res, next) => {
  const id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({message: 'Product ID not valid!'});
  }
  await Product.findById(id)
    .select('_id name price productImage')
    .then(response => {
      if (!response) {
        return res.status(404).json({message: `Product with id: ${id} not found!`});
      }
      res.status(200).json({data: response});
    })
    .catch(error => {
      res.status(500).json({message: error.message});
    });
};

module.exports.product_delete_one = async (req, res, next) => {
  await Product.deleteOne({_id: req.params.id})
    .then(response => {
      if (response.deletedCount < 1) {
        return res.status(404).json({message: `Product with id: ${req.params.id} not found!`});
      }
      res.status(200).json({message: 'Product delete successfuly'});
    })
    .catch(error => {
      res.status(500).json({message: error.message});
    });
};

module.exports.product_patch = async (req, res, next) => {
  const updates = req.body;
  await Product.updateOne({_id: req.params.id}, {$set: updates})
    .then(response => {
      if (response.matchedCount < 1) {
        return res.status(400).json({message: `Item with id: ${req.params.id} not found!`});
      }
      if (!response.acknowledged) {
        return res.status(400).json({message: `Not found invalid parameter!`});
      }
      res.status(200).json({message: 'Item successfully updated!'});
    })
    .catch(error => {
      res.status(500).json({message: error});
    });
}