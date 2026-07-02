const { body, param, query } = require('express-validator');

const VALID_STATUSES = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const updateStatusRules = [
  param('id').isUUID().withMessage('Ticket ID must be a valid UUID'),
  body('status')
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`)
];

const assignTicketRules = [
  param('id').isUUID().withMessage('Ticket ID must be a valid UUID'),
  body('assigned_to')
    .isUUID()
    .withMessage('assigned_to must be a valid UUID')
];

const escalateTicketRules = [
  param('id').isUUID().withMessage('Ticket ID must be a valid UUID')
];

const listTicketsRules = [
  query('status').optional().isIn(VALID_STATUSES),
  query('priority').optional().isIn(VALID_PRIORITIES),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().isString().trim()
];

module.exports = {
  updateStatusRules,
  assignTicketRules,
  escalateTicketRules,
  listTicketsRules
};
