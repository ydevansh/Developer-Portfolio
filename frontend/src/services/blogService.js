import api from './api.js';

export const blogService = {
  getAllBlogs: (featured) => api.get('/blog/all', { params: { featured } }),
  getBlogBySlug: (slug) => api.get(`/blog/${slug}`),
  createBlog: (data) => api.post('/blog', data),
  updateBlog: (id, data) => api.put(`/blog/${id}`, data),
  deleteBlog: (id) => api.delete(`/blog/${id}`),
};

export default blogService;
