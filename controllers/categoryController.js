const Category = require('../models/categoryModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create(req.body);
  res.status(201).json({
    status: 'success',
    isSuccess: true,
    category: newCategory,
  });
});

exports.getAllCategory = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    status: 'success',
    isSuccess: true,
    results: categories.length,
    categories,
  });
});

exports.getOneCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category)
    return next(new AppError('No category found  with this Id', 401));
  res.status(200).json({
    status: 'success',
    isSuccess: true,
    category,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'sucsess',
    isSuccess: true,
    category,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    isSuccess: true,
    category,
  });
});
