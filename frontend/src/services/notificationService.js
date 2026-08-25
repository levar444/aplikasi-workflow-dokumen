import api from './api';

export const notificationService = {
  getNotifications: async () => api.get('/notifications'),
  markAsRead: async (id) => api.put(`/notifications/${id}/read`),
};