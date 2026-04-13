import api from './api.js';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, fullName) =>
    api.post('/auth/register', { email, password, fullName }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default authService;
