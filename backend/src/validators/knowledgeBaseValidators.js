const { body, query } = require('express-validator');

const searchKbRules = [
  query('q')
    .notEmpty().withMessage('Search query is required')
    .isLength({ min: 2 }).withMessage('Search query must be at least 2 characters')
    .trim()
];

const createArticleRules = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title must be under 255 characters'),
  body('content')
    .notEmpty().withMessage('Content is required')
];

module.exports = { searchKbRules, createArticleRules };
