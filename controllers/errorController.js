const AppError = require("../utils/appError");

const handleJWTError = () => new AppError('Please provide a valid token', 401);
const handleJWTExpiredError = () => new AppError('The token has expired, please login again', 401);

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
}

const sendErrorProd = (err, req, res) => {
  if(err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error: ', err)
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Oops Something went very bad'
    });
  }
}


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
}