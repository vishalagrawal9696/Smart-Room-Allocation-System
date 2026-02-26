const AppError = require("../utils/AppError");

/**
 * Handle Mongoose duplicate key errors
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(`Duplicate value '${value}' for field '${field}'`, 409);
};

/**
 * Handle Mongoose validation errors
 */
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(messages.join(". "), 400);
};

/**
 * Handle Mongoose CastError (invalid ObjectId)
 */
const handleCastError = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

/**
 * Global Express error handler
 * Must have 4 parameters to be recognized as error middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  // Normalize known Mongoose errors
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "CastError") error = handleCastError(err);

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : "Internal server error";

  // Log unexpected errors
  if (!error.isOperational) {
    console.error("💥 UNEXPECTED ERROR:", err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = globalErrorHandler;
