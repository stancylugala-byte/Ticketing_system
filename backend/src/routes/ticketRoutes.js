const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { updateStatusRules, assignTicketRules, listTicketsRules } = require('../validators/ticketValidators');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const db = require('../models');
const { User } = db;

router.use(protect);

// Dashboard stats
router.get('/dashboard/stats', ticketController.getDashboardStats);

// Personal performance
router.get('/dashboard/performance', ticketController.getPerformanceStats);

// Global search
router.get('/search', ticketController.searchTickets);

// Get available developers (must be BEFORE /:id route)
router.get('/developers', async (req, res, next) => {
  try {
    const devs = await User.findAll({
      where: { role: 'Developer' },
      attributes: ['id', 'full_name', 'email', 'role'],
      order: [['full_name', 'ASC']],
    });
    res.json({ success: true, data: devs });
  } catch (err) { next(err); }
});

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

// Get ticket attachments (any authenticated user)
router.get('/:id/attachments', async (req, res, next) => {
  try {
    const attachments = await db.Attachment.findAll({
      where: { ticket_id: req.params.id },
      order: [['uploaded_at', 'ASC']],
    });
    res.json({ success: true, data: attachments });
  } catch (err) { next(err); }
});

module.exports = router;
