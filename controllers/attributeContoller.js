const catchAsync = require('../utils/catchAsync');
const Attribute = require('../models/attributeModel');

exports.setProductId = (req, res, next) => {
  if(!req.body.productID) req.body.productID = req.params.productID;
  next();
}

exports.createAttribute = catchAsync(async (req, res, next) => {
  const attribute = await Attribute.create(req.body);
  res.status(200).json({
    status: 'success',
    success: true,
    data: {
      attribute
    }
  });
});

exports.getAllAttribute = catchAsync(async (req, res, next) => {
  const attributes = await Attribute.find();
  res.status(200).json({
    status: 'success',
    success: true,
    data: {
      attributes
    }
  });
});

exports.getAttribute = catchAsync(async (req, res, next) => {
  const query = Attribute.findById(req.params.attributeId);
  const attribute = await query.populate({path: 'varients'});
  res.status(200).json({
    status: 'success',
    success: true,
    data: {
      attribute
    }
  });
});