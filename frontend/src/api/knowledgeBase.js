import api from './axios';

export const getAllArticles = () => api.get('/knowledge-base');
export const searchArticles = (q) => api.get('/knowledge-base/search', { params: { q } });
export const getArticleById = (id) => api.get(`/knowledge-base/${id}`);
export const createArticle = (data) => api.post('/knowledge-base', data);
