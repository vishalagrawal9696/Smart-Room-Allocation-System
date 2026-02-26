/**
 * Standard API response utility
 */

const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendCreated = (res, data, message = "Resource created successfully") => {
  return sendSuccess(res, data, message, 201);
};

const sendError = (res, message = "An error occurred", statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message,
  };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

const sendNotFound = (res, message = "Resource not found") => {
  return sendError(res, message, 404);
};

const sendBadRequest = (res, message = "Bad request", errors = null) => {
  return sendError(res, message, 400, errors);
};

module.exports = { sendSuccess, sendCreated, sendError, sendNotFound, sendBadRequest };
