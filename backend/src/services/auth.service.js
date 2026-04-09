const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

const AuthService = {
  // Register new user
  register: async (userData) => {
    const { email, phone, password, full_name, user_type } = userData;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const existingPhone = await UserModel.findByPhone(phone);
    if (existingPhone) {
      throw new Error('User with this phone number already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await UserModel.create({
      email,
      phone,
      password_hash,
      full_name,
      user_type,
    });

    // Assign default 'user' role
    await UserModel.assignRole(user.id, 'user', user.id);

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      user,
      token,
    };
  },

  // Login user
  login: async (email, password) => {
    // Find user by email
    const user = await UserModel.findWithRoles(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new Error('Account has been deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Remove password hash from response
    delete user.password_hash;

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type, roles: user.roles },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      user,
      token,
    };
  },

  // Verify token
  verifyToken: async (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await UserModel.findById(decoded.id);
      if (!user || !user.is_active) {
        throw new Error('User not found or inactive');
      }
      return { valid: true, user: decoded };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  },

  // Change password
  changePassword: async (userId, oldPassword, newPassword) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await UserModel.update(userId, { password_hash });

    return { message: 'Password changed successfully' };
  },
};

module.exports = AuthService;