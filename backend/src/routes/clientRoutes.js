const express = require('express');
const router  = express.Router();
const { Op }  = require('sequelize');
const db      = require('../models');
const { protect, requireRole } = require('../middleware/authMiddleware');

const { Ticket, TicketComment, TicketCategory, SlaPolicy, User, Notification } = db;

// All client routes require authentication and Client role
router.use(protect);
router.use(requireRole('Client'));

// ── Dashboard Stats ─────────────────────────────────────────────────────────
router.get('/dashboard/stats', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [total, open, pending, resolved] = await Promise.all([
      Ticket.count({ where: { user_id: userId } }),
      Ticket.count({ where: { user_id: userId, status: { [Op.in]: ['Open', 'In Progress'] } } }),
      Ticket.count({ where: { user_id: userId, status: 'Pending' } }),
      Ticket.count({ where: { user_id: userId, status: { [Op.in]: ['Resolved', 'Closed'] } } }),
    ]);
    res.json({ success: true, data: {
      totalTickets: total,
      openTickets: open,
      pendingTickets: pending,
      resolvedTickets: resolved,
    }});
  } catch (err) { next(err); }
});

// ── My Tickets ───────────────────────────────────────────────────────────────
router.get('/tickets', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = { user_id: req.user.id };
    if (status) where.status = status;

    const { count, rows } = await Ticket.findAndCountAll({
      where,
      include: [
        { model: TicketCategory, as: 'category', attributes: ['category_id', 'category_name'] },
        { model: SlaPolicy, as: 'slaPolicy', attributes: ['response_time', 'resolution_time'] },
        { model: User, as: 'assignee', attributes: ['id', 'full_name'] },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    res.json({ success: true, data: { total: count, page: parseInt(page), limit: parseInt(limit), tickets: rows } });
  } catch (err) { next(err); }
});

// ── Single Ticket with Comments ───────────────────────────────────────────────
router.get('/tickets/:id', async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [
        { model: TicketCategory, as: 'category', attributes: ['category_id', 'category_name'] },
        { model: SlaPolicy, as: 'slaPolicy', attributes: ['response_time', 'resolution_time'] },
        { model: User, as: 'assignee', attributes: ['id', 'full_name'] },
        {
          model: TicketComment, as: 'comments',
          where: { is_internal: false },
          required: false,
          include: [{ model: User, as: 'author', attributes: ['id', 'full_name', 'role'] }],
          order: [['created_at', 'ASC']],
        },
      ],
    });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, data: ticket });
  } catch (err) { next(err); }
});

// ── Create Ticket ─────────────────────────────────────────────────────────────
router.post('/tickets', async (req, res, next) => {
  try {
    const { title, description, category_id, priority = 'Medium' } = req.body;
    if (!title?.trim()) return res.status(422).json({ success: false, message: 'Title is required' });
    if (!description?.trim()) return res.status(422).json({ success: false, message: 'Description is required' });

    const ticket = await Ticket.create({
      title: title.trim(),
      description: description.trim(),
      category_id: category_id || null,
      priority,
      status: 'Open',
      user_id: req.user.id,
    });
    res.status(201).json({ success: true, data: ticket });
  } catch (err) { next(err); }
});

// ── Add Comment (client reply — public only) ──────────────────────────────────
router.post('/tickets/:id/comments', async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (ticket.status === 'Closed') return res.status(400).json({ success: false, message: 'Cannot comment on a closed ticket' });

    const comment = await TicketComment.create({
      ticket_id: req.params.id,
      user_id: req.user.id,
      comment: req.body.comment,
      is_internal: false,
    });
    res.status(201).json({ success: true, data: comment });
  } catch (err) { next(err); }
});

// ── Close Ticket ───────────────────────────────────────────────────────────────
router.patch('/tickets/:id/close', async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (ticket.status !== 'Resolved') return res.status(400).json({ success: false, message: 'Only resolved tickets can be closed' });

    await ticket.update({ status: 'Closed' });
    res.json({ success: true, data: ticket });
  } catch (err) { next(err); }
});

// ── Reopen Ticket ──────────────────────────────────────────────────────────────
router.patch('/tickets/:id/reopen', async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (ticket.status !== 'Closed') return res.status(400).json({ success: false, message: 'Only closed tickets can be reopened' });

    await ticket.update({ status: 'Open' });
    res.json({ success: true, data: ticket });
  } catch (err) { next(err); }
});

// ── Categories (for ticket creation form) ─────────────────────────────────────
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await TicketCategory.findAll({ order: [['category_name', 'ASC']] });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
});

// ── Notifications ─────────────────────────────────────────────────────────────
router.get('/notifications', async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      limit: 30,
    });
    const unreadCount = notifications.filter(n => !n.is_read).length;
    res.json({ success: true, data: { notifications, unreadCount } });
  } catch (err) { next(err); }
});

router.patch('/notifications/:id/read', async (req, res, next) => {
  try {
    const notif = await Notification.findOne({ where: { notification_id: req.params.id, user_id: req.user.id } });
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
    await notif.update({ is_read: true });
    res.json({ success: true, data: notif });
  } catch (err) { next(err); }
});

router.patch('/notifications/mark-all-read', async (req, res, next) => {
  try {
    await Notification.update({ is_read: true }, { where: { user_id: req.user.id } });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) { next(err); }
});

module.exports = router;
