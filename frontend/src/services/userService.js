import api from './api';

export const userService = {
  getProfile: async () => api.get('/users/profile'),
  updateProfile: async (data) => api.put('/users/profile', data),
  getUsers: async () => api.get('/users'),
  updateUserRole: async (id, role) => api.put(`/users/${id}/role`, { role }),
};