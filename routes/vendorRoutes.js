const { Router } = require('express');
const authController = require('../controllers/authController');
const Vendor = require('../models/vendorModels');

const router = Router();

router.post('/signup', authController.signup(Vendor));
router.post('/login', authController.login(Vendor));
router.post('/forgotpassword', authController.forgotPassword(Vendor, 'vendors'));
router.patch('/resetpassword/:token', authController.resetPassword(Vendor));
router.patch('/updatepassword', authController.protect(Vendor), authController.updatePassword(Vendor)); 
router.patch('/deactivateme', authController.protect(Vendor), authController.deactivateMe(Vendor));
router.get('/logout', authController.protect(Vendor), authController.logout);

module.exports = router;