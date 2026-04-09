const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { errorResponse } = require('../utils/response');
const UserModel = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'No token provided. Please login.');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user still exists and is active
    const user = await UserModel.findById(decoded.id);
    if (!user || !user.is_active) {
      return errorResponse(res, 401, 'User not found or account deactivated.');
    }

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      user_type: decoded.user_type,
      roles: decoded.roles || [],
    };

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid token.');
    }
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token expired. Please login again.');
    }
    next(err);
  }
};

// Role-based access control middleware
const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Not authenticated');
    }

    const userRoles = req.user.roles || ['user'];
    const hasRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return errorResponse(res, 403, 'Access denied. Insufficient permissions.');
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  requireRoles,
};