import api from './api.js';

export const contactService = {
  submitForm: (data) => api.post('/contact', data),
  getAllMessages: () => api.get('/contact/all'),
  getMessageById: (id) => api.get(`/contact/${id}`),
  deleteMessage: (id) => api.delete(`/contact/${id}`),
};

export default contactService;
