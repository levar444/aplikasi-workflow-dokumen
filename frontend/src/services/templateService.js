import api from './api';

export const templateService = {
  getTemplates: async () => api.get('/templates'),
  createTemplate: async (data) => api.post('/templates', data),
  updateTemplate: async (id, data) => api.put(`/templates/${id}`, data),
  deleteTemplate: async (id) => api.delete(`/templates/${id}`),
};