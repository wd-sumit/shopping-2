const catchAsync = require("../utils/catchAsync");
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require("../utils/appError");

const createResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: 'success',
    isSucess: true,
    results: data.length,
    data
  });
}

exports.getAll = (Model) => catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Model.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const data = await features.query;
  createResponse(res, 200, data);
});

exports.getOne = (Model) => catchAsync(async (req, res, next) => {
  const data = await Model.findById(req.params.id);
  if(!data) return next(new AppError('data with that Id not found', 400));
  createResponse(res, 200, data);
});

exports.createOne = (Model) => catchAsync(async (req, res, next) => {
  const newData = await Model.create(req.body);
  createResponse(res, 201, newData);
});

exports.UpdateOne = (Model) => catchAsync(async (req, res, next) => {
  const updatedData = await Model.findByIdAndUpate(req.params.id, req.body, {
    new: true,
    runValidator: true
  });
  createResponse(res, 200, updatedData);
});

exports.deleteOne = (Model) => catchAsync(async (req, res, next) => {
  const data = await Model.findByIdAndDelete(req.params.id);
  createResponse(res, 204, data);
});