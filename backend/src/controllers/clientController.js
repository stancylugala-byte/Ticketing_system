const clientService = require('../services/clientService');

// Get dashboard stats
const getDashboardStats = async (req, res, next) => {
  try {
    const data = await clientService.getDashboardStats(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Get client's tickets
const getMyTickets = async (req, res, next) => {
  try {
    const data = await clientService.getClientTickets(req.user.id, req.query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Get single ticket by ID
const getTicketById = async (req, res, next) => {
  try {
    const data = await clientService.getTicketDetail(req.params.id, req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Create new ticket
const createTicket = async (req, res, next) => {
  try {
    const data = await clientService.createTicket(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Update ticket
const updateTicket = async (req, res, next) => {
  try {
    const data = await clientService.updateTicket(req.params.id, req.user.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Reopen ticket
const reopenTicket = async (req, res, next) => {
  try {
    const data = await clientService.reopenTicket(req.params.id, req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Close ticket
const closeTicket = async (req, res, next) => {
  try {
    const data = await clientService.closeTicket(req.params.id, req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Add comment to ticket
const addComment = async (req, res, next) => {
  try {
    const data = await clientService.addClientComment(req.params.id, req.user.id, req.body.comment);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Get notifications
const getNotifications = async (req, res, next) => {
  try {
    const data = await clientService.getClientNotifications(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Get categories
const getCategories = async (req, res, next) => {
  try {
    const data = await clientService.getCategories();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
  getMyTickets,
  getTicketById,
  createTicket,
  updateTicket,
  reopenTicket,
  closeTicket,
  addComment,
  getNotifications,
  getCategories
};
