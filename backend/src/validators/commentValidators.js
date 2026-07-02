const { body, param } = require('express-validator');

const addCommentRules = [
  param('id').isUUID().withMessage('Ticket ID must be a valid UUID'),
  body('comment')
    .notEmpty().withMessage('Comment cannot be empty')
    .isLength({ max: 5000 }).withMessage('Comment must be under 5000 characters'),
  body('is_internal')
    .optional()
    .isBoolean().withMessage('is_internal must be true or false')
];

module.exports = { addCommentRules };
