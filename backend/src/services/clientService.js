const { Op } = require('sequelize');
const db = require('../models');

const { Ticket, User, TicketCategory, SlaPolicy, TicketComment, Notification, Feedback } = db;

// Get dashboard stats for client
const getDashboardStats = async (userId) => {
  const [totalTickets, openTickets, pendingTickets, resolvedTickets] = await Promise.all([
    // Total tickets (lifetime)
    Ticket.count({ where: { user_id: userId } }),
    
    // Open tickets (Open + In Progress)
    Ticket.count({ 
      where: { 
        user_id: userId, 
        status: { [Op.in]: ['Open', 'In Progress'] } 
      } 
    }),
    
    // Pending tickets
    Ticket.count({ 
      where: { 
        user_id: userId, 
        status: 'Pending' 
      } 
    }),
    
    // Resolved tickets (Resolved + Closed)
    Ticket.count({ 
      where: { 
        user_id: userId, 
        status: { [Op.in]: ['Resolved', 'Closed'] } 
      } 
    })
  ]);

  return { totalTickets, openTickets, pendingTickets, resolvedTickets };
};

// Get client's tickets with filters and pagination
const getClientTickets = async (userId, filters = {}) => {
  const { status, priority, search, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;
  
  const where = { user_id: userId };
  
  // Filter by status
  if (status) {
    where.status = status;
  }
  
  // Filter by priority
  if (priority) {
    where.priority = priority;
  }
  
  // Search in title or description
  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }
  
  const { count, rows } = await Ticket.findAndCountAll({
    where,
    include: [
      { 
        model: TicketCategory, 
        as: 'category', 
        attributes: ['category_id', 'category_name'] 
      },
      { 
        model: User, 
        as: 'assignee', 
        attributes: ['id', 'full_name'] 
      }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset
  });

  return { 
    tickets: rows, 
    total: count, 
    page: parseInt(page), 
    totalPages: Math.ceil(count / limit) 
  };
};

// Get ticket detail (only if belongs to client)
const getTicketDetail = async (ticketId, userId) => {
  const ticket = await Ticket.findOne({
    where: { 
      id: ticketId, 
      user_id: userId 
    },
    include: [
      { 
        model: TicketCategory, 
        as: 'category', 
        attributes: ['category_id', 'category_name'] 
      },
      { 
        model: User, 
        as: 'assignee', 
        attributes: ['id', 'full_name'] 
      },
      { 
        model: SlaPolicy, 
        as: 'slaPolicy', 
        attributes: ['sla_id', 'priority', 'response_time', 'resolution_time'] 
      },
      {
        model: TicketComment,
        as: 'comments',
        where: { is_internal: false }, // Only public comments for clients
        required: false,
        include: [{ 
          model: User, 
          as: 'author', 
          attributes: ['id', 'full_name', 'role'] 
        }],
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

// Create new ticket
const createTicket = async (userId, data) => {
  const { title, description, category_id, priority } = data;
  
  // Find SLA policy based on priority
  const slaPolicy = await SlaPolicy.findOne({ 
    where: { priority } 
  });
  
  const ticket = await Ticket.create({
    title,
    description,
    priority,
    category_id,
    user_id: userId,
    sla_id: slaPolicy ? slaPolicy.sla_id : null,
    status: 'Open'
  });

  // Return ticket with category
  return Ticket.findByPk(ticket.id, {
    include: [
      { 
        model: TicketCategory, 
        as: 'category', 
        attributes: ['category_id', 'category_name'] 
      }
    ]
  });
};

// Update ticket (only Open tickets)
const updateTicket = async (ticketId, userId, data) => {
  const ticket = await Ticket.findOne({
    where: { 
      id: ticketId, 
      user_id: userId 
    }
  });

  if (!ticket) {
    const err = new Error('Ticket not found');
    err.status = 404;
    throw err;
  }

  // Can only update open tickets
  if (ticket.status !== 'Open') {
    const err = new Error('Can only update open tickets');
    err.status = 400;
    throw err;
  }

  // Update allowed fields
  const { title, description, priority } = data;
  const updates = {};
  
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (priority !== undefined) updates.priority = priority;

  await ticket.update(updates);
  
  return Ticket.findByPk(ticketId, {
    include: [
      { 
        model: TicketCategory, 
        as: 'category', 
        attributes: ['category_id', 'category_name'] 
      }
    ]
  });
};

// Reopen ticket (Closed → Open)
const reopenTicket = async (ticketId, userId) => {
  const ticket = await Ticket.findOne({
    where: { 
      id: ticketId, 
      user_id: userId 
    }
  });

  if (!ticket) {
    const err = new Error('Ticket not found');
    err.status = 404;
    throw err;
  }

  // Can only reopen closed tickets
  if (ticket.status !== 'Closed') {
    const err = new Error('Can only reopen closed tickets');
    err.status = 400;
    throw err;
  }

  await ticket.update({ status: 'Open' });
  
  return Ticket.findByPk(ticketId, {
    include: [
      { 
        model: TicketCategory, 
        as: 'category', 
        attributes: ['category_id', 'category_name'] 
      },
      { 
        model: User, 
        as: 'assignee', 
        attributes: ['id', 'full_name'] 
      }
    ]
  });
};

// Close ticket (Resolved → Closed)
const closeTicket = async (ticketId, userId) => {
  const ticket = await Ticket.findOne({
    where: { 
      id: ticketId, 
      user_id: userId 
    }
  });

  if (!ticket) {
    const err = new Error('Ticket not found');
    err.status = 404;
    throw err;
  }

  // Can only close resolved tickets
  if (ticket.status !== 'Resolved') {
    const err = new Error('Can only close resolved tickets');
    err.status = 400;
    throw err;
  }

  await ticket.update({ status: 'Closed' });
  
  // Create feedback entry (rating = 0 as placeholder)
  await Feedback.create({
    ticket_id: ticketId,
    user_id: userId,
    rating: 0,
    comments: null
  });
  
  return Ticket.findByPk(ticketId, {
    include: [
      { 
        model: TicketCategory, 
        as: 'category', 
        attributes: ['category_id', 'category_name'] 
      },
      { 
        model: User, 
        as: 'assignee', 
        attributes: ['id', 'full_name'] 
      }
    ]
  });
};

// Add client comment (always public)
const addClientComment = async (ticketId, userId, commentText) => {
  // Verify ticket belongs to client
  const ticket = await Ticket.findOne({
    where: { 
      id: ticketId, 
      user_id: userId 
    }
  });

  if (!ticket) {
    const err = new Error('Ticket not found');
    err.status = 404;
    throw err;
  }

  const comment = await TicketComment.create({
    ticket_id: ticketId,
    user_id: userId,
    comment: commentText,
    is_internal: false // Always public for clients
  });

  // Return comment with author details
  return TicketComment.findByPk(comment.id, {
    include: [{ 
      model: User, 
      as: 'author', 
      attributes: ['id', 'full_name', 'role'] 
    }]
  });
};

// Get client notifications
const getClientNotifications = async (userId) => {
  const notifications = await Notification.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']]
  });

  const unreadCount = await Notification.count({
    where: { 
      user_id: userId, 
      is_read: false 
    }
  });

  return { notifications, unreadCount };
};

// Get all categories
const getCategories = async () => {
  return TicketCategory.findAll({
    attributes: ['category_id', 'category_name'],
    order: [['category_name', 'ASC']]
  });
};

module.exports = {
  getDashboardStats,
  getClientTickets,
  getTicketDetail,
  createTicket,
  updateTicket,
  reopenTicket,
  closeTicket,
  addClientComment,
  getClientNotifications,
  getCategories
};
