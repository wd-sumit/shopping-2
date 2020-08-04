const Cart = require('../models/cartModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.addToCart = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  req.body.product = req.params.productId;
  const cartItem = await Cart.create(req.body);
  res.status(201).json({
    status: 'success',
    success: true,
    data: {
      cartItem
    }
  });
});

exports.getAllCartItem = catchAsync(async (req, res, next) => {
  const query = Cart.findOne({user: req.user.id});
  const item = await query.populate('product');
  if(!item) return next(new AppError('No item found', 404));
  res.status(200).json({
    status: 'success',
    success: true,
    data: {
      item
    }
  });
});

