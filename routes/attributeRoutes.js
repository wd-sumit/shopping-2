const express = require('express');
const attributeController = require('../controllers/attributeContoller');

const router = express.Router({mergeParams: true});

router
  .route('/')
  .get(attributeController.getAllAttribute)
  .post(attributeController.createAttribute);

router
  .route('/:attributeId')
  .get(attributeController.getAttribute);


module.exports = router;