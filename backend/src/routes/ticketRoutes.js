const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { updateStatusRules, assignTicketRules, listTicketsRules } = require('../validators/ticketValidators');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Dashboard stats
router.get('/dashboard/stats', ticketController.getDashboardStats);

// Personal performance
router.get('/dashboard/performance', ticketController.getPerformanceStats);

// Global search
router.get('/search', ticketController.searchTickets);

// Ticket queue (queue param: assigned | pending | escalated | unassigned | new)
router.get('/', listTicketsRules, validate, ticketController.getTicketQueue);

// Single ticket
router.get('/:id', ticketController.getTicketById);

// Update status
router.patch('/:id/status', updateStatusRules, validate, ticketController.updateTicketStatus);

// Claim ticket (assign to self)
router.patch('/:id/claim', ticketController.claimTicket);

// Assign ticket to specific agent
router.patch('/:id/assign', assignTicketRules, validate, ticketController.assignTicket);

module.exports = router;
