import api from './api.js';

export const skillService = {
  getAllSkills: () => api.get('/skills/all'),
  getSkillsByCategory: (category) => api.get(`/skills/category/${category}`),
  createSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
};

export default skillService;
