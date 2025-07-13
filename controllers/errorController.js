/* eslint-disable prefer-const */
/* eslint-disable node/no-unsupported-features/es-syntax */
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateID = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  const message = `Duplicate ${field} with value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = ()=> new AppError('Invalid JWT Token! Please login again', 400)

const handleJWTExpiredError = ()=> new AppError('Token Exipred! Please login again', 400)
const sendErrorDev = (err, res) => {
  console.error('Error🔥', err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else { // programming error 
    console.error('Error🔥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(Object.getPrototypeOf(err));
    Object.assign(error, err);
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateID(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if(error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if(error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
    sendErrorProd(error, res);
  }
};

module.exports = errorController;
