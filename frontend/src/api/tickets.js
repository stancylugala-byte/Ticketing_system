import api from './axios';

export const getDashboardStats = () => api.get('/tickets/dashboard/stats');
export const getPerformanceStats = () => api.get('/tickets/dashboard/performance');
export const getTicketQueue = (params) => api.get('/tickets', { params });
export const getTicketById = (id) => api.get(`/tickets/${id}`);
export const updateTicketStatus = (id, status) => api.patch(`/tickets/${id}/status`, { status });
export const claimTicket = (id) => api.patch(`/tickets/${id}/claim`);
export const assignTicket = (id, assigned_to) => api.patch(`/tickets/${id}/assign`, { assigned_to });
export const searchTickets = (q) => api.get('/tickets/search', { params: { q } });

export const getComments = (ticketId) => api.get(`/tickets/${ticketId}/comments`);
export const addComment = (ticketId, comment, is_internal = false) =>
  api.post(`/tickets/${ticketId}/comments`, { comment, is_internal });
