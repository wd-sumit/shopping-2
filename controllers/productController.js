const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const Category = require('../models/categoryModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

const createResponse = (res, statusCode, product) => {
  res.status(statusCode).json({
    status: 'success',
    isSucess: true,
    result: product.length,
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
  await Promise.all(
    req.body.category.map(async (id) => {
      const category = await Category.findById(id);
      category.products.push(newProduct.id);
      await category.save();
    })
  );
  res.status(200).json({
    status: 'success',
    isSuccess: true,
    newProduct,
  });
});

exports.getOneProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: 'attributes',
    })
    .populate({
      path: 'category',
      select: '-products -createdAt',
    });
  if (!product) return next(new AppError('data with that Id not found', 400));
  createResponse(res, 200, product);
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidator: true,
    }
  );
  createResponse(res, 200, updatedProduct);
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  createResponse(res, 204, deletedProduct);
});

exports.getAllProductByCreator = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(
    Product.find({ createdBy: req.user._id }),
    req.query
  )
    .filter()
    .sort()
    .fields()
    .paginate();

  const products = await features.query;
  res.status(200).json({
    status: 'success',
    isSuccess: true,
    results: products.length,
    products,
  });
});
