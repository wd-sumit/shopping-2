const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.setUserRole = (role) => (req, res, next) => {
  req.query.role = role;
  next();
};

exports.getAllUser = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const users = await features.query;
  res.status(200).json({
    status: 'success',
    isSuccess: true,
    results: users.length,
    users,
  });
});

exports.getOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User with this ID not found', 401));
  res.status(200).json({
    status: 'success',
    isSucces: true,
    user,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    isSuccess: true,
    newUser,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const data = { ...req.body };
  const excludedFields = ['password', 'confirmPassword', 'createdAt'];
  excludedFields.forEach((el) => delete data[el]);
  const user = await User.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'success',
    isSuccess: true,
    user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    isSuccess: true,
    user,
  });
});

exports.getUserByRole = (...roles) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(
      User.find({ role: { $in: roles } }),
      req.query
    );
    const vendors = await features.query;
    res.status(200).json({
      status: 'success',
      isSuccess: true,
      results: vendors.length,
      vendors,
    });
  });
