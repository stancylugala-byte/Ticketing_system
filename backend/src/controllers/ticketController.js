const ticketService = require('../services/ticketService');

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await ticketService.getDashboardStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};

const getTicketQueue = async (req, res, next) => {
  try {
    const { queue = 'assigned', search, page, limit } = req.query;
    const data = await ticketService.getTicketQueue({
      queue, officerId: req.user.id, search, page, limit
    });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    res.json({ success: true, data: ticket });
  } catch (err) { next(err); }
};

const updateTicketStatus = async (req, res, next) => {
  try {
    const ticket = await ticketService.updateTicketStatus(
      req.params.id, req.body.status, req.user.id
    );
    res.json({ success: true, data: ticket });
  } catch (err) { next(err); }
};

const claimTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.claimTicket(req.params.id, req.user.id);
    res.json({ success: true, data: ticket });
  } catch (err) { next(err); }
};

const assignTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.assignTicket(req.params.id, req.body.assigned_to);
    res.json({ success: true, data: ticket });
  } catch (err) { next(err); }
};

const searchTickets = async (req, res, next) => {
  try {
    const tickets = await ticketService.searchTickets(req.query.q, req.user.id);
    res.json({ success: true, data: tickets });
  } catch (err) { next(err); }
};

const getPerformanceStats = async (req, res, next) => {
  try {
    const stats = await ticketService.getPerformanceStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};

module.exports = {
  getDashboardStats, getTicketQueue, getTicketById,
  updateTicketStatus, claimTicket, assignTicket,
  searchTickets, getPerformanceStats
};
