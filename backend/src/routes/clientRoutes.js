const express = require('express');
const router  = express.Router();
const { Op }  = require('sequelize');
const path    = require('path');
const multer  = require('multer');
const db      = require('../models');
const { protect, requireRole }    = require('../middleware/authMiddleware');
const { createNotification }      = require('../services/notificationService');

const { Ticket, TicketComment, TicketCategory, SlaPolicy, User, Notification, Feedback, Attachment } = db;

// ── Multer config — images only, max 5MB each, max 5 files ───────────────────
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads/attachments'),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${Date.now()}-${req.user?.id?.slice(0,8) || 'u'}-${safe}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg','image/png','image/gif','image/webp','image/svg+xml'];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only image files are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
});

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
    const { page = 1, limit = 10, status, search } = req.query;
    const { Op } = require('sequelize');
    const where = { user_id: req.user.id };
    if (status) where.status = status;
    if (search?.trim()) {
      where[Op.or] = [
        { title:       { [Op.like]: `%${search.trim()}%` } },
        { description: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

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
    const { title, description, category_id, priority = 'Medium', tag } = req.body;
    if (!title?.trim()) return res.status(422).json({ success: false, message: 'Title is required' });
    if (!description?.trim()) return res.status(422).json({ success: false, message: 'Description is required' });

    const ticket = await Ticket.create({
      title:       title.trim(),
      description: description.trim(),
      category_id: category_id || null,
      priority,
      status:      'Open',
      user_id:     req.user.id,
      tag:         tag ? tag.trim().slice(0, 100) : null,
    });

    // Confirm creation to the client
    createNotification({
      userId:  req.user.id,
      title:   'Ticket Created',
      message: `Your ticket "${ticket.title}" (${priority} priority) has been submitted and is now in our queue.`,
      type:    'success',
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

// ── Update Ticket (client can add info) ───────────────────────────────────────
router.patch('/tickets/:id', async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (['Closed', 'Resolved'].includes(ticket.status)) {
      return res.status(400).json({ success: false, message: 'Cannot update a resolved or closed ticket' });
    }
    const { title, description } = req.body;
    const updates = {};
    if (title?.trim()) updates.title = title.trim();
    if (description?.trim()) updates.description = description.trim();
    await ticket.update(updates);
    res.json({ success: true, data: ticket });
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

router.patch('/notifications/mark-all-read', async (req, res, next) => {
  try {
    await Notification.update({ is_read: true }, { where: { user_id: req.user.id } });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) { next(err); }
});

router.patch('/notifications/:id/read', async (req, res, next) => {
  try {
    const notif = await Notification.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
    await notif.update({ is_read: true });
    res.json({ success: true, data: notif });
  } catch (err) { next(err); }
});

// ── Knowledge Base (public articles) ─────────────────────────────────────────
router.get('/knowledge-base', async (req, res, next) => {
  try {
    const { search } = req.query;
    const { Op } = require('sequelize');
    const KnowledgeBase = db.KnowledgeBase;
    if (!KnowledgeBase) return res.json({ success: true, data: [] });
    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ];
    }
    const articles = await KnowledgeBase.findAll({
      where, order: [['created_at', 'DESC']], limit: 20,
    });
    res.json({ success: true, data: articles });
  } catch (err) { next(err); }
});

// ── CSAT Feedback ─────────────────────────────────────────────────────────────
// POST: client submits a star rating after ticket is resolved
router.post('/tickets/:id/feedback', async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (!['Resolved', 'Closed'].includes(ticket.status)) {
      return res.status(400).json({ success: false, message: 'Feedback can only be submitted for resolved or closed tickets' });
    }

    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(422).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    // Upsert — allow updating feedback
    const [feedback, created] = await Feedback.findOrCreate({
      where: { ticket_id: req.params.id },
      defaults: { ticket_id: req.params.id, user_id: req.user.id, rating, comments: comment || null },
    });
    if (!created) {
      await feedback.update({ rating, comments: comment || null });
    }

    // Auto-close ticket when feedback is submitted
    if (ticket.status === 'Resolved') {
      await ticket.update({ status: 'Closed' });
    }

    res.status(created ? 201 : 200).json({ success: true, data: feedback });
  } catch (err) { next(err); }
});

// GET: check if feedback already exists for a ticket
router.get('/tickets/:id/feedback', async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    const feedback = await Feedback.findOne({ where: { ticket_id: req.params.id } });
    res.json({ success: true, data: feedback || null });
  } catch (err) { next(err); }
});

// ── Upload attachments to a ticket ───────────────────────────────────────────
router.post('/tickets/:id/attachments', upload.array('files', 5), async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (!req.files || req.files.length === 0) {
      return res.status(422).json({ success: false, message: 'No files uploaded' });
    }

    const saved = await Promise.all(req.files.map(f =>
      Attachment.create({
        ticket_id:   req.params.id,
        user_id:     req.user.id,
        file_name:   f.originalname,
        file_path:   `/uploads/attachments/${f.filename}`,
        file_size:   f.size,
        mime_type:   f.mimetype,
        uploaded_at: new Date(),
      })
    ));

    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE')  return res.status(422).json({ success: false, message: 'File too large. Max 5MB per image.' });
    if (err.code === 'LIMIT_FILE_COUNT') return res.status(422).json({ success: false, message: 'Too many files. Max 5 images.' });
    next(err);
  }
});

// ── Get attachments for a ticket ──────────────────────────────────────────────
router.get('/tickets/:id/attachments', async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    const attachments = await Attachment.findAll({ where: { ticket_id: req.params.id }, order: [['uploaded_at', 'ASC']] });
    res.json({ success: true, data: attachments });
  } catch (err) { next(err); }
});

module.exports = router;
