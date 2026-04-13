import api from './api.js';

export const serviceService = {
  getAllServices: () => api.get('/services/all'),
  getFeaturedServices: () => api.get('/services/featured'),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),
};

export default serviceService;
