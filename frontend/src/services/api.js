import axios from 'axios';

const api = axios.create({
  baseURL: 'https://aplikasi-workflow-dokumen-production.up.railway.app/api', 
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