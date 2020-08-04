const express = require('express');
const Admin = require('../models/adminModel');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup',authController.protect(Admin) ,authController.signup(Admin));
router.post('/login', authController.login(Admin));
router.post('/forgotpassword', authController.forgotPassword(Admin));
router.patch('/resetpassword/:token', authController.resetPassword(Admin));
router.patch('/updatepassword', authController.protect(Admin), authController.updatePassword(Admin)); 
router.patch('/deactivateme', authController.protect(Admin), authController.deactivateMe(Admin));
router.get('/logout', authController.logout);

module.exports = router;