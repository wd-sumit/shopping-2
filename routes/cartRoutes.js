const router = require('express').Router();
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(cartController.getAllCartItem)
  .post(authController.protect, cartController.addToCart);

router
.route('/:id')
.patch(authController.protect, cartController.updateCartItem);

module.exports = router;
