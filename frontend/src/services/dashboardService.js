import api from './api';

export const dashboardService = {
  getDashboardUser1: async () => api.get('/dashboard/user1'),
  getDashboardUser2: async () => api.get('/dashboard/user2'),
  getDashboardUser3: async () => api.get('/dashboard/user3'),
  getDashboardUser4: async () => api.get('/dashboard/user4'),
};