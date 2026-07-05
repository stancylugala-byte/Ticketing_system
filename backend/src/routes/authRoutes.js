const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules
} = require('../validators/authValidators');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

// Public auth routes
router.post('/register',        registerRules,       validate, authController.register);
router.post('/login',           loginRules,          validate, authController.login);
router.post('/forgot-password', forgotPasswordRules, validate, authController.forgotPassword);
router.post('/reset-password',  resetPasswordRules,  validate, authController.resetPassword);

// Protected — get current logged-in user
router.get('/me', protect, authController.getMe);

module.exports = router;
