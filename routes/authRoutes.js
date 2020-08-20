const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/signup')
  .post(authController.signup);

router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router
  .route('/updatepassword')
  .patch(authController.protect, authController.updatePassword);

module.exports = router;
