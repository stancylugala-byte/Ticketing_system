const { Op } = require('sequelize');
const db = require('../models');
const { createNotification } = require('./notificationService');

const { Ticket, User, TicketCategory, SlaPolicy, TicketComment } = db;

// Shared include config for ticket queries
const ticketIncludes = [
  { model: User, as: 'client', attributes: ['id', 'full_name', 'email'] },
  { model: User, as: 'assignee', attributes: ['id', 'full_name', 'email'] },
  { model: TicketCategory, as: 'category', attributes: ['category_id', 'category_name'] },
  { model: SlaPolicy, as: 'slaPolicy', attributes: ['sla_id', 'priority', 'response_time', 'resolution_time'] }
];

// Dashboard stats for a support officer
const getDashboardStats = async (officerId) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [assigned, pending, resolvedToday, slaBreaches] = await Promise.all([
    Ticket.count({ where: { assigned_to: officerId, status: { [Op.in]: ['Open', 'In Progress'] } } }),
    Ticket.count({ where: { assigned_to: officerId, status: 'Pending' } }),
    Ticket.count({ where: { assigned_to: officerId, status: 'Resolved', updated_at: { [Op.gte]: todayStart } } }),
    // SLA breach: tickets that are open AND past their resolution deadline
    Ticket.findAll({
      where: { assigned_to: officerId, status: { [Op.in]: ['Open', 'In Progress', 'Pending'] } },
      include: [{ model: SlaPolicy, as: 'slaPolicy', required: true }],
    }).then(tickets => tickets.filter(t => {
      const limitMs = t.slaPolicy.resolution_time * 60 * 60 * 1000;
      return Date.now() - new Date(t.created_at).getTime() > limitMs;
    }).length)
  ]);

  return { assigned, pending, resolvedToday, slaBreaches };
};

// Get tickets for a queue with filters and pagination
const getTicketQueue = async ({ queue, officerId, search, page = 1, limit = 20 }) => {
  const limitInt  = parseInt(limit,  10) || 20;
  const pageInt   = parseInt(page,   10) || 1;
  const offset    = (pageInt - 1) * limitInt;
  let where = {};

  switch (queue) {
    case 'assigned':
      where = { assigned_to: officerId, status: { [Op.in]: ['Open', 'In Progress'] } };
      break;
    case 'pending':
      where = { assigned_to: officerId, status: 'Pending' };
      break;
    case 'escalated':
      where = { assigned_to: officerId, priority: { [Op.in]: ['High', 'Critical'] } };
      break;
    case 'unassigned':
      where = { assigned_to: null, status: 'Open' };
      break;
    case 'new':
      where = { status: 'Open' };
      break;
    default:
      where = {};
  }

  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }

  const { count, rows } = await Ticket.findAndCountAll({
    where,
    include: ticketIncludes,
    order: [['created_at', 'DESC']],
    limit:  limitInt,
    offset
  });

  return { total: count, page: pageInt, limit: limitInt, tickets: rows };
};

// Get single ticket with full details including comments
const getTicketById = async (ticketId) => {
  const ticket = await Ticket.findByPk(ticketId, {
    include: [
      ...ticketIncludes,
      {
        model: TicketComment,
        as: 'comments',
        include: [{ model: User, as: 'author', attributes: ['id', 'full_name', 'role'] }],
        order: [['created_at', 'ASC']]
      }
    ]
  });

  if (!ticket) {
    const err = new Error('Ticket not found');
    err.status = 404;
    throw err;
  }
  return ticket;
};

// Update ticket status
const updateTicketStatus = async (ticketId, status, officerId) => {
  const ticket = await Ticket.findByPk(ticketId);
  if (!ticket) { const e = new Error('Ticket not found'); e.status = 404; throw e; }

  await ticket.update({ status });

  // Notify the client on meaningful status changes
  if (['Resolved', 'Closed', 'Pending'].includes(status)) {
    const messages = {
      Resolved: `Your ticket "${ticket.title}" has been resolved. Please confirm the fix or reopen if needed.`,
      Closed:   `Your ticket "${ticket.title}" has been closed. Thank you for using our support.`,
      Pending:  `Your ticket "${ticket.title}" is pending — a support officer needs more information from you.`,
    };
    createNotification({
      userId:  ticket.user_id,
      title:   `Ticket ${status}`,
      message: messages[status],
      type:    status === 'Resolved' || status === 'Closed' ? 'success' : 'warning',
    });
  }

  return getTicketById(ticketId);
};

// Claim / assign a ticket to a support officer
const claimTicket = async (ticketId, officerId) => {
  const ticket = await Ticket.findByPk(ticketId);
  if (!ticket) { const e = new Error('Ticket not found'); e.status = 404; throw e; }

  await ticket.update({ assigned_to: officerId, status: 'In Progress' });

  // Notify the client that their ticket has been picked up
  createNotification({
    userId:  ticket.user_id,
    title:   'Ticket Assigned',
    message: `Your ticket "${ticket.title}" has been assigned to a support officer and is now In Progress.`,
    type:    'info',
  });

  return getTicketById(ticketId);
};

// Assign ticket to a specific agent
const assignTicket = async (ticketId, assigneeId) => {
  const ticket = await Ticket.findByPk(ticketId);
  if (!ticket) { const e = new Error('Ticket not found'); e.status = 404; throw e; }

  await ticket.update({ assigned_to: assigneeId, status: 'In Progress' });
  return getTicketById(ticketId);
};

// Search tickets globally
const searchTickets = async (query, officerId) => {
  const tickets = await Ticket.findAll({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } }
          ]
        },
        {
          [Op.or]: [{ assigned_to: officerId }, { assigned_to: null }]
        }
      ]
    },
    include: ticketIncludes,
    limit: 20,
    order: [['created_at', 'DESC']]
  });
  return tickets;
};

// Personal performance stats
const getPerformanceStats = async (officerId) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [totalClosed, recentTickets] = await Promise.all([
    Ticket.count({ where: { assigned_to: officerId, status: { [Op.in]: ['Resolved', 'Closed'] } } }),
    Ticket.findAll({
      where: {
        assigned_to: officerId,
        status: { [Op.in]: ['Resolved', 'Closed'] },
        updated_at: { [Op.gte]: thirtyDaysAgo }
      },
      attributes: ['created_at', 'updated_at']
    })
  ]);

  let avgResolutionTime = 0;
  if (recentTickets.length > 0) {
    const totalMs = recentTickets.reduce((sum, t) => {
      return sum + (new Date(t.updated_at) - new Date(t.created_at));
    }, 0);
    avgResolutionTime = Math.round(totalMs / recentTickets.length / (1000 * 60)); // in minutes
  }

  return { totalClosed, avgResolutionTime, ticketsLast30Days: recentTickets.length };
};

module.exports = {
  getDashboardStats,
  getTicketQueue,
  getTicketById,
  updateTicketStatus,
  claimTicket,
  assignTicket,
  searchTickets,
  getPerformanceStats
};
