import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // ✅ Full URL to your backend
  headers: { 'Content-Type': 'application/json' }
});

export default api;