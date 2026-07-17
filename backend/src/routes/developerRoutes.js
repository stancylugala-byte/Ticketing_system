const express = require('express');
const router  = express.Router();
const { Op }  = require('sequelize');
const db      = require('../models');
const { protect, requireRole } = require('../middleware/authMiddleware');

const { Ticket, User, TicketCategory, SlaPolicy, TicketComment } = db;

router.use(protect);
router.use(requireRole('Developer'));

// ── Shared include helpers ────────────────────────────────────────────────────
const ticketIncludes = [
  { model: User,           as: 'client',    attributes: ['id', 'full_name', 'email'] },
  { model: TicketCategory, as: 'category',  attributes: ['category_id', 'category_name'] },
  { model: SlaPolicy,      as: 'slaPolicy', attributes: ['sla_id', 'priority', 'response_time', 'resolution_time'] },
];

const ticketIncludesWithComments = [
  { model: User,           as: 'client',    attributes: ['id', 'full_name', 'email'] },
  { model: TicketCategory, as: 'category',  attributes: ['category_id', 'category_name'] },
  { model: SlaPolicy,      as: 'slaPolicy', attributes: ['sla_id', 'priority', 'response_time', 'resolution_time'] },
  {
    model: TicketComment, as: 'comments',
    include: [{ model: User, as: 'author', attributes: ['id', 'full_name', 'role'] }],
    order: [['created_at', 'ASC']],
  },
];

// ── KPIs ──────────────────────────────────────────────────────────────────────
router.get('/kpis', async (req, res, next) => {
  try {
    const devId = req.user.id;

    const [assigned, critical, open, resolved, allResolved] = await Promise.all([
      Ticket.count({ where: { assigned_to: devId } }),
      Ticket.count({ where: { assigned_to: devId, priority: 'Critical', status: { [Op.notIn]: ['Resolved', 'Closed'] } } }),
      Ticket.count({ where: { assigned_to: devId, status: { [Op.in]: ['Open', 'In Progress', 'Pending'] } } }),
      Ticket.count({ where: { assigned_to: devId, status: { [Op.in]: ['Resolved', 'Closed'] } } }),
      Ticket.findAll({
        where: { assigned_to: devId, status: { [Op.in]: ['Resolved', 'Closed'] } },
        attributes: ['created_at', 'updated_at'],
      }),
    ]);

    const total      = assigned;
    const fixedRatio = total > 0 ? Math.round((resolved / total) * 100) : 0;

    let mttr = 0;
    if (allResolved.length > 0) {
      const totalMs = allResolved.reduce(
        (s, t) => s + (new Date(t.updated_at) - new Date(t.created_at)), 0
      );
      mttr = parseFloat((totalMs / allResolved.length / (1000 * 60 * 60)).toFixed(1));
    }

    res.json({ success: true, data: { assigned, critical, open, resolved, fixedRatio, mttr } });
  } catch (err) { next(err); }
});

// ── Bugs (all tickets assigned to this dev) ───────────────────────────────────
router.get('/bugs', async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 50 } = req.query;
    const where = { assigned_to: req.user.id };
    if (status)   where.status   = status;
    if (priority) where.priority = priority;

    const { count, rows } = await Ticket.findAndCountAll({
      where,
      include: ticketIncludes,
      order: [['created_at', 'DESC']],
      limit:  parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({ success: true, data: { total: count, page: parseInt(page), bugs: rows } });
  } catch (err) { next(err); }
});

// ── Bug detail with comments ───────────────────────────────────────────────────
router.get('/bugs/:id', async (req, res, next) => {
  try {
    const bug = await Ticket.findOne({
      where: { id: req.params.id, assigned_to: req.user.id },
      include: ticketIncludesWithComments,
    });
    if (!bug) return res.status(404).json({ success: false, message: 'Bug not found' });
    res.json({ success: true, data: bug });
  } catch (err) { next(err); }
});

// ── Update bug status ─────────────────────────────────────────────────────────
router.patch('/bugs/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const VALID = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
    if (!VALID.includes(status))
      return res.status(422).json({ success: false, message: 'Invalid status value' });

    const bug = await Ticket.findOne({
      where: { id: req.params.id, assigned_to: req.user.id },
    });
    if (!bug) return res.status(404).json({ success: false, message: 'Bug not found' });

    await bug.update({ status });

    // Return with full includes so frontend can refresh
    const updated = await Ticket.findByPk(bug.id, { include: ticketIncludesWithComments });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

// ── Add internal note ─────────────────────────────────────────────────────────
router.post('/bugs/:id/notes', async (req, res, next) => {
  try {
    const { comment } = req.body;
    if (!comment?.trim())
      return res.status(422).json({ success: false, message: 'comment is required' });

    const bug = await Ticket.findOne({ where: { id: req.params.id, assigned_to: req.user.id } });
    if (!bug) return res.status(404).json({ success: false, message: 'Bug not found' });

    const note = await TicketComment.create({
      ticket_id:   req.params.id,
      user_id:     req.user.id,
      comment:     comment.trim(),
      is_internal: true,
    });
    res.status(201).json({ success: true, data: note });
  } catch (err) { next(err); }
});

// ── Open incidents (not resolved/closed) ─────────────────────────────────────
router.get('/incidents/open', async (req, res, next) => {
  try {
    const bugs = await Ticket.findAll({
      where: {
        assigned_to: req.user.id,
        status: { [Op.in]: ['Open', 'In Progress', 'Pending'] },
      },
      include: ticketIncludes,
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: bugs });
  } catch (err) { next(err); }
});

// ── Critical incidents ────────────────────────────────────────────────────────
router.get('/incidents/critical', async (req, res, next) => {
  try {
    const bugs = await Ticket.findAll({
      where: {
        assigned_to: req.user.id,
        priority: 'Critical',
        status: { [Op.notIn]: ['Resolved', 'Closed'] },
      },
      include: ticketIncludes,
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: bugs });
  } catch (err) { next(err); }
});

// ── Log work hours (stored as internal comment) ───────────────────────────────
router.post('/bugs/:id/worklog', async (req, res, next) => {
  try {
    const { hours, description } = req.body;
    if (!hours || !description?.trim())
      return res.status(422).json({ success: false, message: 'hours and description are required' });

    const bug = await Ticket.findOne({ where: { id: req.params.id, assigned_to: req.user.id } });
    if (!bug) return res.status(404).json({ success: false, message: 'Bug not found' });

    const entry = await TicketComment.create({
      ticket_id:   req.params.id,
      user_id:     req.user.id,
      comment:     `[WORK LOG] ${hours}h — ${description.trim()}`,
      is_internal: true,
    });
    res.status(201).json({ success: true, data: entry });
  } catch (err) { next(err); }
});

// ── Resolution note or RCA ────────────────────────────────────────────────────
router.post('/bugs/:id/resolution', async (req, res, next) => {
  try {
    const { type, content } = req.body;
    if (!content?.trim())
      return res.status(422).json({ success: false, message: 'content is required' });

    const bug = await Ticket.findOne({ where: { id: req.params.id, assigned_to: req.user.id } });
    if (!bug) return res.status(404).json({ success: false, message: 'Bug not found' });

    const prefix = type === 'rca' ? '[ROOT CAUSE ANALYSIS]' : '[RESOLUTION NOTE]';
    await TicketComment.create({
      ticket_id:   req.params.id,
      user_id:     req.user.id,
      comment:     `${prefix} ${content.trim()}`,
      is_internal: true,
    });

    // Auto-resolve on resolution note (not RCA)
    if (type === 'note') await bug.update({ status: 'Resolved' });

    const updated = await Ticket.findByPk(bug.id, { include: ticketIncludesWithComments });
    res.status(201).json({ success: true, data: updated });
  } catch (err) { next(err); }
});

// ── Developer performance ─────────────────────────────────────────────────────
router.get('/performance', async (req, res, next) => {
  try {
    const devId = req.user.id;

    const [total, resolved] = await Promise.all([
      Ticket.count({ where: { assigned_to: devId } }),
      Ticket.count({ where: { assigned_to: devId, status: { [Op.in]: ['Resolved', 'Closed'] } } }),
    ]);

    const resolvedTickets = await Ticket.findAll({
      where: { assigned_to: devId, status: { [Op.in]: ['Resolved', 'Closed'] } },
      attributes: ['created_at', 'updated_at'],
    });

    const fixedRatio = total > 0 ? parseFloat(((resolved / total) * 100).toFixed(1)) : 0;

    let mttr = 0;
    if (resolvedTickets.length > 0) {
      const totalMs = resolvedTickets.reduce(
        (s, t) => s + (new Date(t.updated_at) - new Date(t.created_at)), 0
      );
      mttr = parseFloat((totalMs / resolvedTickets.length / (1000 * 60 * 60)).toFixed(1));
    }

    res.json({ success: true, data: { total, resolved, fixedRatio, mttr } });
  } catch (err) { next(err); }
});

module.exports = router;
