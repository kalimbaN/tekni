const AuthService = require('../services/auth.service');
const UserModel = require('../models/user.model');  // ← ADD THIS LINE
const { successResponse, errorResponse } = require('../utils/response');

const AuthController = {
  // Register
  register: async (req, res, next) => {
    try {
      const { user, token } = await AuthService.register(req.body);
      successResponse(res, 201, 'User registered successfully', { user, token });
    } catch (err) {
      next(err);
    }
  },

  // Login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);
      successResponse(res, 200, 'Login successful', { user, token });
    } catch (err) {
      next(err);
    }
  },

  // Get current user
  getMe: async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        throw new Error('User not found');
      }
      successResponse(res, 200, 'User profile retrieved', { user });
    } catch (err) {
      next(err);
    }
  },

  // Change password
  changePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(req.user.id, oldPassword, newPassword);
      successResponse(res, 200, result.message);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;