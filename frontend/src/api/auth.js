import api from './axios';

// ✅ Clean the data before sending - remove empty 'name' field
export const registerUser = (data) => {
  // Remove any empty fields that might cause validation issues
  const cleanData = { ...data };

  // If name is empty string, remove it
  if (cleanData.name === '') {
    delete cleanData.name;
  }

  return api.post('/auth/register', cleanData);
};

export const loginUser         = (data)  => api.post('/auth/login', data);
export const forgotPasswordReq = (email) => api.post('/auth/forgot-password', { email });
export const resetPasswordReq  = (data)  => api.post('/auth/reset-password', data);
export const getMe             = ()      => api.get('/auth/me');