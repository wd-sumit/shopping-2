const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route('/top-rated-products')
  .get(productController.topRatedProducts, productController.getAllProducts);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.allowedTo('vendor', 'superadmin', 'admin'),
    productController.setCreator,
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getOneProduct)
  .patch(
    authController.allowedTo('vendor', 'superadmin', 'admin'),
    productController.updateProduct
  )
  .delete(
    authController.allowedTo('vendor', 'superadmin', 'admin'),
    productController.deleteProduct
  );

module.exports = router;
