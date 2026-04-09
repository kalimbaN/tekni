const { errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  // Log error
  logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific errors
  if (err.code === '23505') { // PostgreSQL unique violation
    statusCode = 409;
    message = 'Duplicate entry. This record already exists.';
  }

  if (err.code === '23503') { // PostgreSQL foreign key violation
    statusCode = 400;
    message = 'Related record not found.';
  }

  // Send response
  errorResponse(res, statusCode, message);
};

module.exports = errorMiddleware;