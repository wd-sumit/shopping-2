const catchAsync = require('../utils/catchAsync');
const Attribute = require('../models/attributeModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.setProductId = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

exports.createAttribute = catchAsync(async (req, res, next) => {
  const attribute = await Attribute.create(req.body);
  res.status(201).json({
    status: 'success',
    isSuccess: true,
    attribute,
  });
});

exports.getAllAttributes = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Attribute.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const attributes = await features.query;
  if (!attributes)
    return next(new AppError('No attribute found for this product', 404));
  res.status(200).json({
    status: 'success',
    isSuccess: true,
    results: attributes.length,
    attributes,
  });
});

exports.getOneAttribute = catchAsync(async (req, res, next) => {
  const attribute = await Attribute.findById(req.params.id);
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
