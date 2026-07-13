const { body } = require('express-validator');

const registerRules = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be 2–100 characters'),

  body('email')
    .isEmail().withMessage('A valid email address is required')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['Client', 'SupportOfficer', 'Developer', 'Manager', 'Admin'])
    .withMessage('Role must be Client, SupportOfficer, Developer, Manager, or Admin'),
];

const loginRules = [
  body('email')
    .isEmail().withMessage('A valid email address is required')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

const forgotPasswordRules = [
  body('email')
    .isEmail().withMessage('A valid email address is required')
    .normalizeEmail()
];

const resetPasswordRules = [
  body('token')
    .notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

module.exports = {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules
};





