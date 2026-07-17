import api from './axios';

// ── KPIs ──────────────────────────────────────────────────────────────────────
export const fetchDevKPIs = () =>
  api.get('/developer/kpis').then(r => r.data.data);

// ── Bug Management ────────────────────────────────────────────────────────────
export const fetchBugs = (params = {}) =>
  api.get('/developer/bugs', { params }).then(r => r.data.data);

export const fetchBugById = (id) =>
  api.get(`/developer/bugs/${id}`).then(r => r.data.data);

export const updateBugStatus = (id, status) =>
  api.patch(`/developer/bugs/${id}/status`, { status }).then(r => r.data.data);

export const addBugNote = (id, comment) =>
  api.post(`/developer/bugs/${id}/notes`, { comment }).then(r => r.data.data);

// ── Incident Management ───────────────────────────────────────────────────────
export const fetchOpenIncidents = () =>
  api.get('/developer/incidents/open').then(r => r.data.data);

export const fetchCriticalIncidents = () =>
  api.get('/developer/incidents/critical').then(r => r.data.data);

// ── Work Logs ─────────────────────────────────────────────────────────────────
export const logWorkHours = (id, hours, description) =>
  api.post(`/developer/bugs/${id}/worklog`, { hours, description }).then(r => r.data.data);

// ── Resolution Center ─────────────────────────────────────────────────────────
export const submitResolution = (id, type, content) =>
  api.post(`/developer/bugs/${id}/resolution`, { type, content }).then(r => r.data.data);

// ── Performance ───────────────────────────────────────────────────────────────
export const fetchDevPerformance = () =>
  api.get('/developer/performance').then(r => r.data.data);
