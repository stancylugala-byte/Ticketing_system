const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');  // ✅ Correct path
const validate = require('../middleware/validate');
const {
    registerRules,
    loginRules,
    forgotPasswordRules,
    resetPasswordRules
} = require('../validators/authValidators');

// ✅ Public routes with validation
router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/forgot-password', forgotPasswordRules, validate, forgotPassword);
router.post('/reset-password', resetPasswordRules, validate, resetPassword);

// ✅ Protected route
router.get('/me', protect, getMe);

module.exports = router;
