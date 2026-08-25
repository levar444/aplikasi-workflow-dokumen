import axios from 'axios';

// Otomatis memilih URL Railway jika diakses online, atau localhost jika di laptop
const baseURL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001/api' 
  : 'https://aplikasi-workflow-dokumen-production.up.railway.app/api';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk otomatis menyertakan token di setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;