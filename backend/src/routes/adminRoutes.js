const express   = require('express');
const router    = express.Router();
const { Op, fn, col } = require('sequelize');
const db        = require('../models');
const { protect, requireRole } = require('../middleware/authMiddleware');

const { User, Ticket, TicketCategory, SlaPolicy } = db;

router.use(protect);
router.use(requireRole('Admin'));

// ─── KPIs ─────────────────────────────────────────────────────────────────────
router.get('/kpis', async (req, res, next) => {
  try {
    const [totalClients, totalUsers, activeTickets] = await Promise.all([
      User.count({ where: { role: 'Client' } }),
      User.count(),
      Ticket.count({ where: { status: { [Op.ne]: 'Closed' } } }),
    ]);
    res.json({ success: true, data: { totalClients, totalUsers, activeTickets, systemHealth: '99.98%' } });
  } catch (err) { next(err); }
});

// ─── User Management ──────────────────────────────────────────────────────────
router.get('/users', async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const where = {};
    if (role)   where.role  = role;
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

router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'full_name', 'email', 'role', 'created_at'],
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['Client', 'SupportOfficer', 'Developer', 'Manager', 'Admin'];
    if (!validRoles.includes(role)) {
      return res.status(422).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.update({ role });
    res.json({ success: true, data: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.destroy();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) { next(err); }
});

// ─── Ticket Categories ─────────────────────────────────────────────────────────
router.get('/categories', async (req, res, next) => {
  try {
    const cats = await TicketCategory.findAll({ order: [['category_name', 'ASC']] });
    res.json({ success: true, data: cats });
  } catch (err) { next(err); }
});

router.post('/categories', async (req, res, next) => {
  try {
    const { category_name } = req.body;
    if (!category_name?.trim()) return res.status(422).json({ success: false, message: 'Category name required' });
    const cat = await TicketCategory.create({ category_name: category_name.trim() });
    res.status(201).json({ success: true, data: cat });
  } catch (err) { next(err); }
});

router.put('/categories/:id', async (req, res, next) => {
  try {
    const cat = await TicketCategory.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    await cat.update({ category_name: req.body.category_name.trim() });
    res.json({ success: true, data: cat });
  } catch (err) { next(err); }
});

router.delete('/categories/:id', async (req, res, next) => {
  try {
    const cat = await TicketCategory.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    await cat.destroy();
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) { next(err); }
});

// ─── SLA Settings ─────────────────────────────────────────────────────────────
router.get('/sla', async (req, res, next) => {
  try {
    const rules = await SlaPolicy.findAll({ order: [['sla_id', 'ASC']] });
    res.json({ success: true, data: rules });
  } catch (err) { next(err); }
});

router.put('/sla/:id', async (req, res, next) => {
  try {
    const rule = await SlaPolicy.findByPk(req.params.id);
    if (!rule) return res.status(404).json({ success: false, message: 'SLA rule not found' });
    const { response_time, resolution_time } = req.body;
    await rule.update({ response_time, resolution_time });
    res.json({ success: true, data: rule });
  } catch (err) { next(err); }
});

// ─── Audit Logs — User Activity (recent user record changes) ──────────────────
router.get('/audit/users', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'full_name', 'email', 'role', 'created_at', 'updated_at'],
      order: [['updated_at', 'DESC']],
      limit: 50,
    });
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
});

// ─── Audit Logs — Login History (recent user logins = recently updated sessions) ──
router.get('/audit/logins', async (req, res, next) => {
  try {
    // Approximate: users ordered by most recently updated (reflects last login)
    const users = await User.findAll({
      attributes: ['id', 'full_name', 'email', 'role', 'updated_at'],
      order: [['updated_at', 'DESC']],
      limit: 30,
    });
    res.json({ success: true, data: users.map(u => ({
      user_id:   u.id,
      full_name: u.full_name,
      email:     u.email,
      role:      u.role,
      last_seen: u.updated_at,
    })) });
  } catch (err) { next(err); }
});

// ─── Audit Logs — Ticket History ──────────────────────────────────────────────
router.get('/audit/tickets', async (req, res, next) => {
  try {
    const tickets = await Ticket.findAll({
      attributes: ['id', 'title', 'status', 'priority', 'created_at', 'updated_at'],
      include: [
        { model: User, as: 'client',   attributes: ['full_name', 'email'] },
        { model: User, as: 'assignee', attributes: ['full_name'] },
      ],
      order: [['updated_at', 'DESC']],
      limit: 100,
    });
    res.json({ success: true, data: tickets });
  } catch (err) { next(err); }
});

module.exports = router;
