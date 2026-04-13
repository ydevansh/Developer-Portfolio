import api from './api.js';

export const testimonialService = {
  getAllTestimonials: () => api.get('/testimonials/all'),
  createTestimonial: (data) => api.post('/testimonials', data),
  approveTestimonial: (id, approved) =>
    api.put(`/testimonials/approve/${id}`, { approved }),
  updateTestimonial: (id, data) => api.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),
};

export default testimonialService;
