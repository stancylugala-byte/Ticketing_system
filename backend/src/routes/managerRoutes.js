const express   = require('express');
const router    = express.Router();
const { Op, fn, col, literal } = require('sequelize');
const db        = require('../models');
const { protect, requireRole } = require('../middleware/authMiddleware');

const { Ticket, User, TicketCategory, SlaPolicy, Feedback, TicketComment } = db;

router.use(protect);
router.use(requireRole('Manager', 'Admin')); // Manager role + Admin can also access

// ─── Shared ticket includes ───────────────────────────────────────────────────
const ticketIncludes = [
  { model: User,           as: 'client',    attributes: ['id', 'full_name', 'email'] },
  { model: User,           as: 'assignee',  attributes: ['id', 'full_name', 'role'] },
  { model: TicketCategory, as: 'category',  attributes: ['category_id', 'category_name'] },
  { model: SlaPolicy,      as: 'slaPolicy', attributes: ['sla_id', 'priority', 'response_time', 'resolution_time'] },
];

// ─── KPI Cards ────────────────────────────────────────────────────────────────
router.get('/kpis', async (req, res, next) => {
  try {
    const [total, open, avgRating] = await Promise.all([
      Ticket.count(),
      Ticket.count({ where: { status: { [Op.in]: ['Open', 'In Progress'] } } }),
      Feedback.findOne({ attributes: [[fn('AVG', col('rating')), 'avg']], raw: true }),
    ]);

    // SLA breaches: tickets not closed that were created more than their SLA resolution_time ago
    const slaTickets = await Ticket.findAll({
      where: { status: { [Op.notIn]: ['Resolved', 'Closed'] } },
      include: [{ model: SlaPolicy, as: 'slaPolicy', required: true }],
    });
    let breaches = 0;
    for (const t of slaTickets) {
      if (t.slaPolicy) {
        const limitMs = t.slaPolicy.resolution_time * 60 * 60 * 1000;
        if (Date.now() - new Date(t.created_at).getTime() > limitMs) breaches++;
      }
    }

    res.json({ success: true, data: {
      totalTickets: total,
      openTickets: open,
      slaBreaches: breaches,
      csat: avgRating?.avg ? parseFloat(parseFloat(avgRating.avg).toFixed(1)) : null,
    }});
  } catch (err) { next(err); }
});

// ─── All Tickets (paginated, filterable) ─────────────────────────────────────
router.get('/tickets', async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status)   where.status   = status;
    if (priority) where.priority = priority;
    if (search)   where[Op.or]   = [
      { title:       { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];

    const { count, rows } = await Ticket.findAndCountAll({
      where,
      include: ticketIncludes,
      order: [['created_at', 'DESC']],
      limit:  parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    res.json({ success: true, data: { total: count, page: parseInt(page), limit: parseInt(limit), tickets: rows } });
  } catch (err) { next(err); }
});

// ─── Ticket Distribution by status ───────────────────────────────────────────
router.get('/tickets/distribution', async (req, res, next) => {
  try {
    const rows = await Ticket.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status'],
      raw: true,
    });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

// ─── Escalated tickets ────────────────────────────────────────────────────────
router.get('/tickets/escalated', async (req, res, next) => {
  try {
    const tickets = await Ticket.findAll({
      where: { priority: { [Op.in]: ['High', 'Critical'] }, status: { [Op.notIn]: ['Resolved', 'Closed'] } },
      include: ticketIncludes,
      order: [['created_at', 'DESC']],
      limit: 50,
    });
    res.json({ success: true, data: tickets });
  } catch (err) { next(err); }
});

// ─── Ticket trends (last 30 days daily count) ─────────────────────────────────
router.get('/analytics/trends', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days || '30');
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const rows = await Ticket.findAll({
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('COUNT', col('id')), 'count'],
      ],
      where: { created_at: { [Op.gte]: since } },
      group: [fn('DATE', col('created_at'))],
      order: [[fn('DATE', col('created_at')), 'ASC']],
      raw: true,
    });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

// ─── Common issues by category ────────────────────────────────────────────────
router.get('/analytics/common-issues', async (req, res, next) => {
  try {
    const rows = await Ticket.findAll({
      attributes: ['category_id', [fn('COUNT', col('Ticket.id')), 'count']],
      include: [{ model: TicketCategory, as: 'category', attributes: ['category_name'] }],
      group: ['category_id', 'category.category_id'],
      order: [[fn('COUNT', col('Ticket.id')), 'DESC']],
      limit: 8,
      raw: false,
    });
    res.json({ success: true, data: rows.map(r => ({
      category: r.category?.category_name || 'Uncategorized',
      count: parseInt(r.dataValues.count),
    }))});
  } catch (err) { next(err); }
});

// ─── Resolution statistics ────────────────────────────────────────────────────
router.get('/analytics/resolution-stats', async (req, res, next) => {
  try {
    const [total, resolved, firstContact] = await Promise.all([
      Ticket.count(),
      Ticket.count({ where: { status: { [Op.in]: ['Resolved', 'Closed'] } } }),
      // first-contact = resolved tickets with 0 or 1 comment
      Ticket.findAll({
        where: { status: { [Op.in]: ['Resolved', 'Closed'] } },
        include: [{ model: TicketComment, as: 'comments', attributes: ['comment_id'] }],
      }).then(tickets => tickets.filter(t => (t.comments?.length || 0) <= 1).length),
    ]);

    const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;
    const firstContactRate = resolved > 0 ? ((firstContact / resolved) * 100).toFixed(1) : 0;

    res.json({ success: true, data: { total, resolved, resolutionRate, firstContactRate } });
  } catch (err) { next(err); }
});

// ─── Staff Performance ────────────────────────────────────────────────────────
router.get('/team/performance', async (req, res, next) => {
  try {
    const officers = await User.findAll({
      where: { role: { [Op.in]: ['SupportOfficer', 'Developer'] } },
      attributes: ['id', 'full_name', 'role', 'email'],
    });

    const stats = await Promise.all(officers.map(async (officer) => {
      const [assigned, resolved, recentResolved] = await Promise.all([
        Ticket.count({ where: { assigned_to: officer.id } }),
        Ticket.count({ where: { assigned_to: officer.id, status: { [Op.in]: ['Resolved', 'Closed'] } } }),
        Ticket.findAll({
          where: { assigned_to: officer.id, status: { [Op.in]: ['Resolved', 'Closed'] } },
          attributes: ['created_at', 'updated_at'],
          limit: 50,
        }),
      ]);

      let avgResolutionHours = 0;
      if (recentResolved.length > 0) {
        const totalMs = recentResolved.reduce((sum, t) => {
          return sum + (new Date(t.updated_at) - new Date(t.created_at));
        }, 0);
        avgResolutionHours = (totalMs / recentResolved.length / (1000 * 60 * 60)).toFixed(1);
      }

      const feedbacks = await Feedback.findAll({
        include: [{ model: Ticket, as: 'ticket', where: { assigned_to: officer.id }, attributes: [] }],
        attributes: [[fn('AVG', col('rating')), 'avg']],
        raw: true,
      });
      const csat = feedbacks[0]?.avg ? parseFloat(parseFloat(feedbacks[0].avg).toFixed(1)) : null;

      return {
        id: officer.id,
        full_name: officer.full_name,
        role: officer.role,
        email: officer.email,
        assigned,
        resolved,
        avgResolutionHours: parseFloat(avgResolutionHours),
        csat,
      };
    }));

    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
});

// ─── Workload Distribution ────────────────────────────────────────────────────
router.get('/team/workload', async (req, res, next) => {
  try {
    const officers = await User.findAll({
      where: { role: { [Op.in]: ['SupportOfficer', 'Developer'] } },
      attributes: ['id', 'full_name', 'role'],
    });

    const workload = await Promise.all(officers.map(async (o) => {
      const [total, open, pending] = await Promise.all([
        Ticket.count({ where: { assigned_to: o.id } }),
        Ticket.count({ where: { assigned_to: o.id, status: { [Op.in]: ['Open', 'In Progress'] } } }),
        Ticket.count({ where: { assigned_to: o.id, status: 'Pending' } }),
      ]);
      return { id: o.id, full_name: o.full_name, role: o.role, total, open, pending };
    }));

    res.json({ success: true, data: workload });
  } catch (err) { next(err); }
});

// ─── SLA Rules (read + update) ────────────────────────────────────────────────
router.get('/sla/rules', async (req, res, next) => {
  try {
    const rules = await SlaPolicy.findAll({ order: [['sla_id', 'ASC']] });
    res.json({ success: true, data: rules });
  } catch (err) { next(err); }
});

router.put('/sla/rules/:id', async (req, res, next) => {
  try {
    const rule = await SlaPolicy.findByPk(req.params.id);
    if (!rule) return res.status(404).json({ success: false, message: 'SLA rule not found' });
    const { response_time, resolution_time } = req.body;
    await rule.update({ response_time, resolution_time });
    res.json({ success: true, data: rule });
  } catch (err) { next(err); }
});

// ─── SLA Violations ───────────────────────────────────────────────────────────
router.get('/sla/violations', async (req, res, next) => {
  try {
    const active = await Ticket.findAll({
      where: { status: { [Op.notIn]: ['Resolved', 'Closed'] } },
      include: [
        ...ticketIncludes,
        { model: TicketComment, as: 'comments', attributes: ['comment_id'], required: false },
      ],
    });

    const violations = active
      .filter(t => {
        if (!t.slaPolicy) return false;
        const limitMs = t.slaPolicy.resolution_time * 60 * 60 * 1000;
        return Date.now() - new Date(t.created_at).getTime() > limitMs;
      })
      .map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        assignee: t.assignee,
        client: t.client,
        created_at: t.created_at,
        slaPolicy: t.slaPolicy,
        overdueSince: Math.floor(
          (Date.now() - new Date(t.created_at).getTime()) / (1000 * 60 * 60)
        ) - t.slaPolicy.resolution_time,
      }));

    res.json({ success: true, data: violations });
  } catch (err) { next(err); }
});

// ─── Resolution time tracking ─────────────────────────────────────────────────
router.get('/sla/resolution-time', async (req, res, next) => {
  try {
    const resolved = await Ticket.findAll({
      where: { status: { [Op.in]: ['Resolved', 'Closed'] } },
      attributes: ['id', 'title', 'priority', 'created_at', 'updated_at'],
      include: [{ model: SlaPolicy, as: 'slaPolicy', attributes: ['resolution_time'] }],
      order: [['updated_at', 'DESC']],
      limit: 100,
    });

    const data = resolved.map(t => {
      const actualHours = (new Date(t.updated_at) - new Date(t.created_at)) / (1000 * 60 * 60);
      const targetHours = t.slaPolicy?.resolution_time || null;
      return {
        id: t.id,
        title: t.title,
        priority: t.priority,
        actualHours: parseFloat(actualHours.toFixed(2)),
        targetHours,
        withinSla: targetHours ? actualHours <= targetHours : null,
      };
    });

    const avgHours = data.length > 0
      ? parseFloat((data.reduce((s, d) => s + d.actualHours, 0) / data.length).toFixed(2))
      : 0;

    res.json({ success: true, data: { avgHours, tickets: data } });
  } catch (err) { next(err); }
});

// ─── Ticket report summary ────────────────────────────────────────────────────
router.get('/reports/tickets', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const where = {};
    if (from || to) {
      where.created_at = {};
      if (from) where.created_at[Op.gte] = new Date(from);
      if (to)   where.created_at[Op.lte] = new Date(to);
    }

    const [total, byStatus, byPriority] = await Promise.all([
      Ticket.count({ where }),
      Ticket.findAll({
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
        where, group: ['status'], raw: true,
      }),
      Ticket.findAll({
        attributes: ['priority', [fn('COUNT', col('id')), 'count']],
        where, group: ['priority'], raw: true,
      }),
    ]);

    res.json({ success: true, data: { total, byStatus, byPriority } });
  } catch (err) { next(err); }
});

// ─── Employee report ──────────────────────────────────────────────────────────
router.get('/reports/employees', async (req, res, next) => {
  try {
    const officers = await User.findAll({
      where: { role: { [Op.in]: ['SupportOfficer', 'Developer'] } },
      attributes: ['id', 'full_name', 'role', 'email', 'created_at'],
    });

    const data = await Promise.all(officers.map(async o => {
      const [assigned, resolved, open] = await Promise.all([
        Ticket.count({ where: { assigned_to: o.id } }),
        Ticket.count({ where: { assigned_to: o.id, status: { [Op.in]: ['Resolved', 'Closed'] } } }),
        Ticket.count({ where: { assigned_to: o.id, status: { [Op.in]: ['Open', 'In Progress', 'Pending'] } } }),
      ]);
      return { id: o.id, full_name: o.full_name, role: o.role, email: o.email, assigned, resolved, open };
    }));

    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ─── Client report ────────────────────────────────────────────────────────────
router.get('/reports/clients', async (req, res, next) => {
  try {
    const clients = await User.findAll({
      where: { role: 'Client' },
      attributes: ['id', 'full_name', 'email'],
    });

    const data = await Promise.all(clients.map(async c => {
      const [total, resolved, open] = await Promise.all([
        Ticket.count({ where: { user_id: c.id } }),
        Ticket.count({ where: { user_id: c.id, status: { [Op.in]: ['Resolved', 'Closed'] } } }),
        Ticket.count({ where: { user_id: c.id, status: { [Op.in]: ['Open', 'In Progress', 'Pending'] } } }),
      ]);
      return { id: c.id, full_name: c.full_name, email: c.email, total, resolved, open };
    }));

    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ─── List Users (Manager can view all users by role) ─────────────────────────
router.get('/users', async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const where = {};
    if (role)   where.role = role;
    if (search) where[Op.or] = [
      { full_name: { [Op.like]: `%${search}%` } },
      { email:     { [Op.like]: `%${search}%` } },
    ];
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: ['id', 'full_name', 'email', 'role', 'created_at'],
      order: [['created_at', 'DESC']],
      limit:  parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    res.json({ success: true, data: { total: count, page: parseInt(page), users: rows } });
  } catch (err) { next(err); }
});

// ─── Update User Role (Manager can change roles) ──────────────────────────────
router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    const ALLOWED_ROLES = ['Client', 'SupportOfficer', 'Developer', 'Manager'];
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(422).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.update({ role });
    res.json({ success: true, data: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

// ─── Update User (full edit: name, email, role, optional password) ────────────
router.put('/users/:id', async (req, res, next) => {
  try {
    const bcrypt = require('bcryptjs');
    const { full_name, email, role, password } = req.body;
    const ALLOWED_ROLES = ['Client', 'SupportOfficer', 'Developer', 'Manager'];

    if (!full_name?.trim()) return res.status(422).json({ success: false, message: 'Full name is required' });
    if (!email?.trim())     return res.status(422).json({ success: false, message: 'Email is required' });
    if (!ALLOWED_ROLES.includes(role)) return res.status(422).json({ success: false, message: 'Invalid role' });
    if (password && password.length < 6) return res.status(422).json({ success: false, message: 'Password must be at least 6 characters' });

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'Admin') return res.status(403).json({ success: false, message: 'Managers cannot edit Admin accounts' });

    // Check email uniqueness (exclude self)
    const conflict = await User.findOne({ where: { email: email.trim().toLowerCase(), id: { [Op.ne]: req.params.id } } });
    if (conflict) return res.status(409).json({ success: false, message: 'Email is already taken by another user' });

    const updates = { full_name: full_name.trim(), email: email.trim().toLowerCase(), role };
    if (password) updates.password = await bcrypt.hash(password, 12);

    await user.update(updates);
    res.json({ success: true, data: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

// ─── Delete User (Manager can delete non-admin users) ────────────────────────
router.delete('/users/:id', async (req, res, next) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'Admin') {
      return res.status(403).json({ success: false, message: 'Managers cannot delete Admin accounts' });
    }
    await user.destroy();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) { next(err); }
});

// ─── Create User (Manager can create Client/Officer/Developer/Manager accounts) ─
router.post('/users', async (req, res, next) => {
  try {
    const bcrypt = require('bcryptjs');
    const { full_name, email, password, role } = req.body;

    const ALLOWED_ROLES = ['Client', 'SupportOfficer', 'Developer', 'Manager'];
    if (!full_name?.trim()) return res.status(422).json({ success: false, message: 'Full name is required' });
    if (!email?.trim())     return res.status(422).json({ success: false, message: 'Email is required' });
    if (!password || password.length < 6) return res.status(422).json({ success: false, message: 'Password must be at least 6 characters' });
    if (!ALLOWED_ROLES.includes(role))    return res.status(422).json({ success: false, message: `Role must be one of: ${ALLOWED_ROLES.join(', ')}` });

    const existing = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (existing) return res.status(409).json({ success: false, message: 'A user with this email already exists' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      full_name: full_name.trim(),
      email:     email.trim().toLowerCase(),
      password:  hashed,
      role,
    });

    res.status(201).json({
      success: true,
      data: { id: user.id, full_name: user.full_name, email: user.email, role: user.role, created_at: user.created_at },
    });
  } catch (err) { next(err); }
});

module.exports = router;
