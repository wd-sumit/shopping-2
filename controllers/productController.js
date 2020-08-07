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
  const product = await Product.findById(req.params.id);
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

exports.createProductByVendor = catchAsync(async (req, res, next) => {
  req.body.vendor = req.user.id;
  const newProduct = await Product.create(req.body);
  createResponse(res, 201, newProduct);
});

exports.getAllProductByVendor = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(
    Product.find({ vendor: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .fields()
    .paginate();

  const vendorProducts = await features.query;
  createResponse(res, 200, vendorProducts);
});

exports.getOneProductByVendor = catchAsync(async (req, res, next) => {
  const productByVendor = await Product.findOne({
    _id: req.params.id,
    vendor: req.user.id,
  });
  if (!productByVendor)
    return next(new AppError('Product with that Id not Find', 404));
  createResponse(res, 200, productByVendor);
});

exports.updateProductByVendor = catchAsync(async (req, res, next) => {
  const data = { ...req.body };
  const excludedFields = [
    'vendor',
    'sku',
    'ratingsAverage',
    'ratingsQuantity',
    'createdAt',
  ];
  excludedFields.forEach((el) => delete data[el]);
  const updatedProductByVendor = await Product.updateOne(
    { _id: req.params.id, vendor: req.user.id },
    data,
    {
      new: true,
      runValidator: true,
    }
  );
  createResponse(res, 201, updatedProductByVendor);
});

exports.deleteProductByVendor = catchAsync(async (req, res, next) => {
  const deletedProductByVendor = await Product.deleteOne({
    _id: req.params.id,
    vendor: req.user.id,
  });
  createResponse(res, 204, deletedProductByVendor);
});
