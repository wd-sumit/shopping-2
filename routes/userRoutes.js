const express = require('express');
const User = require('../models/userModel');
const authController = require('../controllers/authController');
// const productController = require('../controllers/productController');
const productRouter = require('./productRoutes');

const router = express.Router();

// Middleware for product by user router mounting
router.use('/products', authController.protect(User), productRouter);

router.post('/signup', authController.signup(User));
router.post('/login', authController.login(User));
router.post('/forgotpassword', authController.forgotPassword(User, 'users'));
router.patch('/resetpassword/:token', authController.resetPassword(User));
router.patch('/updatepassword', authController.protect(User), authController.updatePassword(User)); 
router.patch('/deactivateme', authController.protect(User), authController.deactivateMe(User));
router.get('/logout', authController.logout);

module.exports = router;