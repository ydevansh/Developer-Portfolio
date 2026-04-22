import api from './api.js';

export const blogService = {
  getAllBlogs: (params = {}) => api.get('/blog/all', { params }),
  getAdminBlogs: () => api.get('/blog/all', { params: { admin: true } }),
  getBlogBySlug: (slug) => api.get(`/blog/${slug}`),
  createBlog: (data) => api.post('/blog', data),
  updateBlog: (id, data) => api.put(`/blog/${id}`, data),
  deleteBlog: (id) => api.delete(`/blog/${id}`),
};

export default blogService;
