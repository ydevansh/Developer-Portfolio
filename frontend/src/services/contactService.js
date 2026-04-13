import api from './api.js';

export const contactService = {
  submitForm: (data) => api.post('/contact/send', data),
  getAllMessages: () => api.get('/contact/all'),
  getMessageById: (id) => api.get(`/contact/${id}`),
  markAsRead: (id) => api.put(`/contact/${id}/read`),
  deleteMessage: (id) => api.delete(`/contact/${id}`),
};

export default contactService;
