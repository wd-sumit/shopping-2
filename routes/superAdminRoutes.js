const { Router } = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.allowedTo('superadmin'),
    userController.getAllUser
  )
  .post(
    authController.protect,
    authController.allowedTo('superadmin'),
    userController.createUser
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.allowedTo('superadmin'),
    userController.getOneUser
  )
  .patch(
    authController.protect,
    authController.allowedTo('superadmin'),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.allowedTo('superadmin'),
    userController.deleteUser
  );
