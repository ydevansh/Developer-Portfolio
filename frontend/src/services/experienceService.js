import api from './api.js';

export const experienceService = {
  getAllExperience: () => api.get('/experience/all'),
  getExperienceByType: (type) => api.get(`/experience/type/${type}`),
  createExperience: (data) => api.post('/experience', data),
  updateExperience: (id, data) => api.put(`/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/experience/${id}`),
};

export default experienceService;
