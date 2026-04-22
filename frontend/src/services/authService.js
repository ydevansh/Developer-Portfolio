import api from './api.js';

export const authService = {
  // Login and get access token
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password }, { skipAuthRefresh: true });
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('sessionId', response.data.sessionId);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }
      const response = await api.post('/auth/refresh', { refreshToken }, { skipAuthRefresh: true });
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      authService.logout();
      throw error;
    }
  },

  // Logout current session
  logout: async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { sessionId, refreshToken }, { skipAuthRefresh: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
    }
  },

  // Logout all sessions
  logoutAll: async () => {
    try {
      await api.post('/auth/logout-all', {}, { skipAuthRefresh: true });
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
    }
  },

  // Get active sessions
  getSessions: () => api.get('/auth/sessions'),

  // Get stored token
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  getSessionId: () => localStorage.getItem('sessionId'),

  // Set token
  setAccessToken: (token) => localStorage.setItem('accessToken', token),

  // Check if authenticated
  isAuthenticated: () => !!localStorage.getItem('accessToken'),

  // Get user info
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
