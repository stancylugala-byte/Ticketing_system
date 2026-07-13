import api from './axios';

export const getAdminKPIs      = ()         => api.get('/admin/kpis');

// User Management
export const getUsers          = (params)   => api.get('/admin/users', { params });
export const getUserById       = (id)       => api.get(`/admin/users/${id}`);
export const updateUserRole    = (id, role) => api.patch(`/admin/users/${id}/role`, { role });
export const deleteUser        = (id)       => api.delete(`/admin/users/${id}`);

// Ticket Categories
export const getCategories     = ()         => api.get('/admin/categories');
export const createCategory    = (name)     => api.post('/admin/categories', { category_name: name });
export const updateCategory    = (id, name) => api.put(`/admin/categories/${id}`, { category_name: name });
export const deleteCategory    = (id)       => api.delete(`/admin/categories/${id}`);

// SLA Settings
export const getSlaRules       = ()         => api.get('/admin/sla');
export const updateSlaRule     = (id, data) => api.put(`/admin/sla/${id}`, data);

// Audit Logs
export const getUserAuditLog   = ()         => api.get('/admin/audit/users');
export const getLoginHistory   = ()         => api.get('/admin/audit/logins');
export const getTicketHistory  = ()         => api.get('/admin/audit/tickets');
