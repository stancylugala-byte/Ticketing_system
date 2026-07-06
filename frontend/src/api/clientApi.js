import api from './axios';

export const getDashboardStats = () => 
  api.get('/client/dashboard/stats');

export const getMyTickets = (filters = {}) => 
  api.get('/client/tickets', { params: filters });

export const getTicketById = (id) => 
  api.get(`/client/tickets/${id}`);

export const createTicket = (data) => 
  api.post('/client/tickets', data);

export const updateTicket = (id, data) => 
  api.patch(`/client/tickets/${id}`, data);

export const reopenTicket = (id) => 
  api.patch(`/client/tickets/${id}/reopen`);

export const closeTicket = (id) => 
  api.patch(`/client/tickets/${id}/close`);

export const addComment = (id, comment) => 
  api.post(`/client/tickets/${id}/comments`, { comment });

export const getNotifications = () => 
  api.get('/client/notifications');

export const getCategories = () => 
  api.get('/client/categories');
