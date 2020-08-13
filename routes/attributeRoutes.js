const express = require('express');
const attributeController = require('../controllers/attributeContoller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post( attributeController.createAttribute)
  .get(attributeController.setProductId, attributeController.getAllAttributes);

router
  .route('/:id')
  .get(attributeController.setProductId, attributeController.getOneAttribute)
  .patch(attributeController.updateAttribute)
  .delete(attributeController.deleteAttribute);

module.exports = router;
