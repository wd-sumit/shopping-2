const { Router } = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

const router = Router();

router.use(authController.protect, authController.allowedTo('vendor'));

router
  .route('/products')
  .get(productController.getAllProductByCreator)
  .post(authController.setCreator, productController.createProduct);

router
  .route('/products/:id')
  .get(productController.getOneProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
