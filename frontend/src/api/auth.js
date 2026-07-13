import api from './axios';

export const registerUser      = (data)  => api.post('/auth/register', data);
export const loginUser         = (data)  => api.post('/auth/login', data);
export const forgotPasswordReq = (email) => api.post('/auth/forgot-password', { email });
export const resetPasswordReq  = (data)  => api.post('/auth/reset-password', data);
export const getMe             = ()      => api.get('/auth/me');
export const updateProfile     = (data)  => api.patch('/auth/profile', data);
