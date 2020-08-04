const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/top-rated-products')
  .get(
    productController.topRatedProducts, 
    productController.getAllProducts
  );

router.route('/')
  .get(productController.getAllProducts)
  .post(authController.allowedTo('superadmin', 'admin'), productController.createProduct);

router.route('/:id')
  .get(productController.getOneProduct)
  .patch(authController.allowedTo('superadmin', 'admin'), productController.updateProduct)
  .delete(authController.allowedTo('superadmin', 'admin'), productController.deleteProduct);

module.exports = router;