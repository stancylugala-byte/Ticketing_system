const { body, param } = require('express-validator');

// Role guard middleware - ensures only Client role can access
const requireClient = (req, res, next) => {
  if (req.user.role !== 'Client') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied' 
    });
  }
  next();
};

// Create ticket validation
const createTicketRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  
  body('category_id')
    .notEmpty().withMessage('Category is required')
    .isInt().withMessage('Category must be a valid integer'),
  
  body('priority')
    .notEmpty().withMessage('Priority is required')
    .isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Priority must be Low, Medium, High, or Critical')
];

// Update ticket validation
const updateTicketRules = [
  param('id').isUUID().withMessage('Invalid ticket ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Priority must be Low, Medium, High, or Critical')
];

// Add comment validation
const addCommentRules = [
  param('id').isUUID().withMessage('Invalid ticket ID'),
  
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 1 }).withMessage('Comment must be at least 1 character')
];

// Ticket ID validation (for reopen, close, get by ID)
const ticketIdRules = [
  param('id').isUUID().withMessage('Invalid ticket ID')
];

module.exports = {
  requireClient,
  createTicketRules,
  updateTicketRules,
  addCommentRules,
  ticketIdRules
};
