const { Router } = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = Router();

router.use(authController.protect, authController.allowedTo('admin'));

router
  .route('/vendors')
  .get(userController.getUserByRole('vendor'))
  .post(authController.setUserRole('vendor'), userController.createUser);

router
  .route('/vendors/:id')
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route('/products').get(productController.getAllProducts);

router
  .route('/products/:id')
  .get(productController.getOneProduct)
  .delete(productController.deleteProduct);

module.exports = router;
