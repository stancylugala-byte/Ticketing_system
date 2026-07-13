import api from './axios';

export const getKPIs              = ()       => api.get('/manager/kpis');
export const getAllTickets         = (params) => api.get('/manager/tickets', { params });
export const getTicketDistribution = ()      => api.get('/manager/tickets/distribution');
export const getEscalatedTickets   = ()      => api.get('/manager/tickets/escalated');
export const getTicketTrends       = (days)  => api.get('/manager/analytics/trends', { params: { days } });
export const getCommonIssues       = ()      => api.get('/manager/analytics/common-issues');
export const getResolutionStats    = ()      => api.get('/manager/analytics/resolution-stats');
export const getStaffPerformance   = ()      => api.get('/manager/team/performance');
export const getWorkloadDist       = ()      => api.get('/manager/team/workload');
export const getSlaRules           = ()      => api.get('/manager/sla/rules');
export const updateSlaRule         = (id, d) => api.put(`/manager/sla/rules/${id}`, d);
export const getSlaViolations      = ()      => api.get('/manager/sla/violations');
export const getResolutionTime     = ()      => api.get('/manager/sla/resolution-time');
export const getTicketReport       = (p)     => api.get('/manager/reports/tickets', { params: p });
export const getEmployeeReport     = ()      => api.get('/manager/reports/employees');
export const getClientReport       = ()      => api.get('/manager/reports/clients');
