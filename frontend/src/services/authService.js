import api from './api.js';

const ACCESS_TOKEN_KEY = 'accessToken';
const SESSION_ID_KEY = 'sessionId';
const USER_KEY = 'user';
const AUTH_NOTICE_KEY = 'authNotice';
const SESSION_EXPIRED_MESSAGE = 'Session expired. Please login again.';
const TOKEN_EXPIRY_SKEW_SECONDS = 3600;

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
};

const getTokenPayload = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const json = decodeBase64Url(parts[1]);
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = getTokenPayload(token);

  if (!payload || typeof payload.exp !== 'number') {
    return true;
  }

  const expiryMs = payload.exp * 1000;
  return Date.now() >= expiryMs - TOKEN_EXPIRY_SKEW_SECONDS * 1000;
};

const clearAuthData = (notice) => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(SESSION_ID_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(AUTH_NOTICE_KEY);

  if (notice) {
    sessionStorage.setItem(AUTH_NOTICE_KEY, notice);
  }
};

export const authService = {
  SESSION_EXPIRED_MESSAGE,

  // Login and get access token
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password }, { skipAuthRefresh: true });
    if (response.data.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);
      localStorage.setItem(SESSION_ID_KEY, response.data.sessionId);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      sessionStorage.removeItem(AUTH_NOTICE_KEY);
    }
    return response.data;
  },

  // Refresh access token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh', {}, { skipAuthRefresh: true });
    if (response.data.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);
      return response.data;
    }
    throw new Error('No access token returned');
  },

  // Logout current session
  logout: async () => {
    try {
      const sessionId = localStorage.getItem(SESSION_ID_KEY);
      await api.post('/auth/logout', { sessionId }, { skipAuthRefresh: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  },

  // Logout all sessions
  logoutAll: async () => {
    try {
      await api.post('/auth/logout-all', {}, { skipAuthRefresh: true });
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      clearAuthData();
    }
  },

  // Get active sessions
  getSessions: () => api.get('/auth/sessions'),

  // Get stored token
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getSessionId: () => localStorage.getItem(SESSION_ID_KEY),

  // Set token
  setAccessToken: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),

  // Session helpers
  getTokenStatus: () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      return { token: null, isValid: false, isExpired: false };
    }

    const payload = getTokenPayload(token);
    if (!payload) {
      return { token, isValid: false, isExpired: true };
    }

    return { token, isValid: true, isExpired: isTokenExpired(token) };
  },

  clearAuthData: (notice) => clearAuthData(notice),

  getAuthNotice: () => sessionStorage.getItem(AUTH_NOTICE_KEY),
  clearAuthNotice: () => sessionStorage.removeItem(AUTH_NOTICE_KEY),

  // Check if authenticated
  isAuthenticated: () => {
    const status = authService.getTokenStatus();
    return status.isValid && !status.isExpired;
  },

  // Get user info
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
