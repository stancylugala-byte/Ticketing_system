const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const clientMockAuth = require('../middleware/clientMockAuth');
const { requireClient, createTicketRules, updateTicketRules, addCommentRules, ticketIdRules } = require('../validators/clientValidator');
const validate = require('../middleware/validate');

// Apply mock auth and role guard to all routes
router.use(clientMockAuth);
router.use(requireClient);

// Dashboard stats
router.get('/dashboard/stats', clientController.getDashboardStats);

// Tickets
router.get('/tickets', clientController.getMyTickets);
router.get('/tickets/:id', ticketIdRules, validate, clientController.getTicketById);
router.post('/tickets', createTicketRules, validate, clientController.createTicket);
router.patch('/tickets/:id', updateTicketRules, validate, clientController.updateTicket);
router.patch('/tickets/:id/reopen', ticketIdRules, validate, clientController.reopenTicket);
router.patch('/tickets/:id/close', ticketIdRules, validate, clientController.closeTicket);

// Comments
router.post('/tickets/:id/comments', addCommentRules, validate, clientController.addComment);

// Notifications
router.get('/notifications', clientController.getNotifications);

// Categories
router.get('/categories', clientController.getCategories);

module.exports = router;
