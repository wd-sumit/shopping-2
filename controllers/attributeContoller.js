const catchAsync = require('../utils/catchAsync');
const Attribute = require('../models/attributeModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.createAttribute = catchAsync(async (req, res, next) => {
  if (req.params.id) req.body.product = req.params.id;
  const attribute = await Attribute.create(req.body);
  res.status(201).json({
    status: 'success',
    isSuccess: true,
    attribute,
  });
});

exports.getAllAttributes = catchAsync(async (req, res, next) => {
  if (req.params.id) req.body.product = req.params.id;
  const features = new ApiFeatures(Attribute.find(req.body.product), req.query);
  const attributes = await features.query;
  res.status(200).json({
    status: 'success',
    isSuccess: true,
    results: attributes.length,
    attributes,
  });
});

exports.getOneAttribute = catchAsync(async (req, res, next) => {
  const attribute = await Attribute.findOne({ _id: req.params.id });
  if (!attribute)
    return next(new AppError('Attribute with ID does not found', 401));
  res.status(200).json({
    status: 'success',
    isSuccess: true,
    attribute,
  });
});

exports.updateAttribute = catchAsync(async (req, res, next) => {
  const data = { ...req.body };
  const excludedFields = ['product'];
  excludedFields.forEach((el) => delete data[el]);
  const updatedAttribute = await Attribute.findByIdAndUpdate(
    req.params.id,
    data,
    {
      new: true,
      runValidator: true,
    }
  );
  res.status(201).json({
    status: 'success',
    isSuccess: true,
    updatedAttribute,
  });
});

exports.deleteAttribute = catchAsync(async (req, res, next) => {
  const deletedAttribute = await Attribute.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    isSuccess: true,
    deletedAttribute,
  });
});
