import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request interceptor: attach JWT token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401s gracefully
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear local storage
      const currentPath = window.location.pathname;
      if (
        currentPath !== '/login' &&
        currentPath !== '/register' &&
        currentPath !== '/'
      ) {
        localStorage.removeItem('jobconnect_token');
        localStorage.removeItem('jobconnect_user');
      }
    }
    return Promise.reject(error);
  }
);

// Helper to resolve media/image URLs (handles relative /uploads/ vs full https://)
export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  return `${backendBase}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default API;
