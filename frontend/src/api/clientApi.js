import api from './axios';

// Dashboard
export const getDashboardStats  = ()       => api.get('/client/dashboard/stats');

// Tickets
export const getMyTickets       = (params) => api.get('/client/tickets', { params });
export const getTicketById      = (id)     => api.get(`/client/tickets/${id}`);
export const createTicket       = (data)   => api.post('/client/tickets', data);
export const updateTicket       = (id, d)  => api.patch(`/client/tickets/${id}`, d);
export const closeTicket        = (id)     => api.patch(`/client/tickets/${id}/close`);
export const reopenTicket       = (id)     => api.patch(`/client/tickets/${id}/reopen`);
export const addComment         = (id, c)  => api.post(`/client/tickets/${id}/comments`, { comment: c, is_internal: false });

// Categories
export const getCategories      = ()       => api.get('/client/categories');

// Notifications
export const getNotifications   = ()       => api.get('/client/notifications');
export const markNotifRead      = (id)     => api.patch(`/client/notifications/${id}/read`);
export const markAllNotifsRead  = ()       => api.patch('/client/notifications/mark-all-read');

// Knowledge Base
export const getKbArticles      = (search) => api.get('/client/knowledge-base', { params: search ? { search } : {} });

// CSAT Feedback
export const submitFeedback     = (ticketId, rating, comment) =>
  api.post(`/client/tickets/${ticketId}/feedback`, { rating, comment });
export const getFeedback        = (ticketId) =>
  api.get(`/client/tickets/${ticketId}/feedback`);

// Attachments
export const uploadAttachments  = (ticketId, files) => {
  const form = new FormData();
  files.forEach(f => form.append('files', f));
  return api.post(`/client/tickets/${ticketId}/attachments`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const getAttachments     = (ticketId) =>
  api.get(`/client/tickets/${ticketId}/attachments`);
