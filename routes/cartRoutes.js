const router = require('express').Router();
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

router
  .route('/:id')
  .patch(authController.protect, cartController.updateCartItem);

router
  .route('/')
  .get(authController.protect, cartController.getAllCartItem)
  .post(authController.protect, cartController.addToCart);

module.exports = router;
