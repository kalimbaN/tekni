// Success response
const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString(),
  };
  
  if (data) {
    response.data = data;
  }
  
  res.status(statusCode).json(response);
};

// Error response
const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
};