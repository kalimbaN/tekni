const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { body } = require('express-validator');

// Validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^\+250[0-9]{9}$/).withMessage('Valid Rwandan phone number required (+250XXXXXXXXX)'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('user_type').isIn(['commission_agent', 'service_provider', 'individual_seller', 'buyer']),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const changePasswordValidation = [
  body('oldPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

// Routes
router.post('/register', registerValidation, validate, AuthController.register);
router.post('/login', loginValidation, validate, AuthController.login);
router.get('/me', authMiddleware, AuthController.getMe);
router.post('/change-password', authMiddleware, changePasswordValidation, validate, AuthController.changePassword);

module.exports = router;