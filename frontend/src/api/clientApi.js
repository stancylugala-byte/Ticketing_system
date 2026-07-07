import api from './axios';

// ── Dashboard stats (client's own tickets summary) ──────────────────────────
export const getDashboardStats = () => api.get('/client/dashboard/stats');

// ── Tickets ──────────────────────────────────────────────────────────────────
export const getMyTickets = (params) => api.get('/client/tickets', { params });
export const getTicketById = (id) => api.get(`/client/tickets/${id}`);
export const createTicket  = (data) => api.post('/client/tickets', data);
export const closeTicket   = (id) => api.patch(`/client/tickets/${id}/close`);
export const reopenTicket  = (id) => api.patch(`/client/tickets/${id}/reopen`);

// ── Comments ──────────────────────────────────────────────────────────────────
export const addComment = (ticketId, comment) =>
  api.post(`/client/tickets/${ticketId}/comments`, { comment, is_internal: false });

// ── Categories (for new ticket form) ─────────────────────────────────────────
export const getCategories = () => api.get('/client/categories');

// ── Notifications ─────────────────────────────────────────────────────────────
export const getNotifications  = ()   => api.get('/client/notifications');
export const markNotifRead     = (id) => api.patch(`/client/notifications/${id}/read`);
export const markAllNotifsRead = ()   => api.patch('/client/notifications/mark-all-read');
