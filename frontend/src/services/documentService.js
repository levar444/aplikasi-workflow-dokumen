import api from './api';

export const documentService = {
  getDocuments: async (params) => api.get('/documents', { params }),
  getDocumentById: async (id) => api.get(`/documents/${id}`),
  createDocument: async (data) => api.post('/documents', data),
  updateDocument: async (id, data) => api.put(`/documents/${id}`, data),
  submitDocument: async (id, targetRole) => api.post(`/documents/${id}/submit`, { targetRole }),
  approveDocument: async (id) => api.post(`/documents/${id}/approve`),
  reviseDocument: async (id, reason) => api.post(`/documents/${id}/revision`, { reason }),
  getDocumentHistory: async (id) => api.get(`/documents/${id}/history`),
  deleteDocument: async (id) => api.delete(`/documents/${id}`),
};