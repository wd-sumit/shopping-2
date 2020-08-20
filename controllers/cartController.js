const Cart = require('../models/cartModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/productModel');
const APIFeature = require('../utils/apiFeatures');

exports.addToCart = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.product) req.body.product = req.params.productId;
  const product = await Product.findById(req.body.product);
  req.body.price = product.discountedPrice * req.body.quantity;
  const cartItem = await Cart.create(req.body);
  res.status(201).json({
    status: 'success',
    isSuccess: true,
    cartItem,
  });
});

exports.getAllCartItem = catchAsync(async (req, res, next) => {
  const features = new APIFeature(Cart.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const item = await features.query.populate({
    path: 'product',
    select: 'name discountedPrice',
  });
  if (!item) return next(new AppError('No item found', 404));
  res.status(200).json({
    status: 'success',
    isSuccess: true,
    item,
  });
});

exports.updateCartItem = catchAsync(async (req, res, next) => {
  const cartItem = await Cart.findById(req.params.id);
  if (!cartItem) return next(new AppError('No cart item found', 401));
  const data = { ...req.body };
  const excludedFields = ['product', 'user'];
  excludedFields.forEach((el) => delete data[el]);
  data.price = (cartItem.price / cartItem.quantity) * data.quantity;
  const updatedCartItem = await Cart.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'success',
    isSuccess: true,
    updatedCartItem,
  });
});