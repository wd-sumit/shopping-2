const router = require('express').Router();
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

router.route('/:productId')
  .post(authController.protect, cartController.addToCart);

router.route('/')
  .get(authController.protect, cartController.getAllCartItem);

module.exports = router; 