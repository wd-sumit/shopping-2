const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/top-rated-products')
  .get(productController.topRatedProducts, productController.getAllProducts);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.allowedTo('vendor', 'superadmin'),
    authController.setCreator,
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getOneProduct)
  .patch(
    authController.protect,
    authController.allowedTo('vendor', 'superadmin'),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.allowedTo('vendor', 'superadmin', 'admin'),
    productController.deleteProduct
  );

module.exports = router;
