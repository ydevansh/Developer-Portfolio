import axios from 'axios';
import authService from './authService.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];
let isRedirectingToLogin = false;

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const shouldRedirectToLogin = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login';
};

const redirectToLogin = () => {
  if (!shouldRedirectToLogin() || isRedirectingToLogin) {
    return;
  }

  isRedirectingToLogin = true;
  window.location.replace('/admin/login');
};

// Add token to requests
api.interceptors.request.use((config) => {
  const token = authService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.skipAuthRefresh) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await authService.refreshToken();
        const token = authService.getAccessToken();
        processQueue(null, token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        authService.clearAuthData(authService.SESSION_EXPIRED_MESSAGE);
        redirectToLogin();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401) {
      authService.clearAuthData(authService.SESSION_EXPIRED_MESSAGE);
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default api;
