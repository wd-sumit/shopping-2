const { Router } = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const attributeRouter = require('./attributeRoutes');
const Vendor = require('../models/vendorModels');

const router = Router();

router.use('/products/:id/attributes', attributeRouter);

router.post('/signup', authController.signup(Vendor));
router.post('/login', authController.login(Vendor));
router.post(
  '/forgotpassword',
  authController.forgotPassword(Vendor, 'vendors')
);
router.patch('/resetpassword/:token', authController.resetPassword(Vendor));
router.patch(
  '/updatepassword',
  authController.protect(Vendor),
  authController.updatePassword(Vendor)
);
router.patch(
  '/deactivateme',
  authController.protect(Vendor),
  authController.deactivateMe(Vendor)
);

router.get('/logout', authController.protect(Vendor), authController.logout);

router.use(authController.protect(Vendor));

router
  .route('/products')
  .post(productController.createProductByVendor)
  .get(productController.getAllProductByVendor);

router
  .route('/products/:id')
  .get(productController.getOneProductByVendor)
  .patch(productController.updateProductByVendor)
  .delete(productController.deleteProductByVendor);

module.exports = router;
