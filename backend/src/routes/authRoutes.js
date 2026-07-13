const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate  = require('../middleware/validate');
const {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules
} = require('../validators/authValidators');

// Public routes
router.post('/register',        registerRules,       validate, register);
router.post('/login',           loginRules,          validate, login);
router.post('/forgot-password', forgotPasswordRules, validate, forgotPassword);
router.post('/reset-password',  resetPasswordRules,  validate, resetPassword);

// Protected routes
router.get('/me',      protect, getMe);
router.patch('/profile', protect, updateProfile);

module.exports = router;
