const db = require('../models');
const { TicketComment, User, Ticket } = db;

// Add a comment (public reply or internal note)
const addComment = async ({ ticketId, userId, comment, is_internal = false }) => {
  const ticket = await Ticket.findByPk(ticketId);
  if (!ticket) { const e = new Error('Ticket not found'); e.status = 404; throw e; }

  const created = await TicketComment.create({
    ticket_id: ticketId,
    user_id: userId,
    comment,
    is_internal
  });

  // Return with author details
  return TicketComment.findByPk(created.comment_id, {
    include: [{ model: User, as: 'author', attributes: ['id', 'full_name', 'role'] }]
  });
};

// Get all comments for a ticket
const getComments = async (ticketId, includeInternal = true) => {
  const where = { ticket_id: ticketId };
  if (!includeInternal) where.is_internal = false;

  return TicketComment.findAll({
    where,
    include: [{ model: User, as: 'author', attributes: ['id', 'full_name', 'role'] }],
    order: [['created_at', 'ASC']]
  });
};

module.exports = { addComment, getComments };
