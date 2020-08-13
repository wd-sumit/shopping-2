const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

const createResponse = (res, statusCode, product) => {
  res.status(statusCode).json({
    status: 'success',
    isSucess: true,
    results: product.length,
    product,
  });
};

exports.setCreator = (req, res, next) => {
  req.body.createdBy = req.user._id;
  next();
};

exports.topRatedProducts = (req, res, next) => {
  req.query.limit = '20';
  req.query.sort = '-ratingsAverage,price';
  next();
};

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const products = await features.query;
  createResponse(res, 200, products);
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  createResponse(res, 201, newProduct);
});

exports.getOneProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'attributes',
  });
  if (!product) return next(new AppError('data with that Id not found', 400));
  createResponse(res, 200, product);
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const updateProduct = await Product.findByIdAndUpate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidator: true,
    }
  );
  createResponse(res, 200, updateProduct);
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  createResponse(res, 204, deletedProduct);
});
