const express = require('express');
const route = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/verify-token');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '_' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 Mb
  },
  fileFilter: fileFilter
});

const productController = require('../controller/product');

// get all
route.get('/', productController.product_get_all);

// post product
route.post('/', verifyToken, upload.single('productImage'), productController.product_create)

// get product by Id
route.get('/:id', productController.product_get_by_id);

// delete product by Id
route.delete('/:id', verifyToken, productController.product_delete_one);

// patch product by Id
route.patch('/:id', verifyToken, productController.product_patch);

module.exports = route;