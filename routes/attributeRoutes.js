const express = require('express');
const attributeController = require('../controllers/attributeContoller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(attributeController.createAttribute)
  .get(attributeController.getAllAttributes);

router
  .route('/:id')
  .get(attributeController.getOneAttribute)
  .patch(attributeController.updateAttribute)
  .delete(attributeController.deleteAttribute);

module.exports = router;
