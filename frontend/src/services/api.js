import axios from 'axios';

/**
 * Intelligently resolve the backend API Base URL across development and production deployments.
 * Supports VITE_API_URL, REACT_APP_API_URL, and VITE_BACKEND_URL.
 * Normalizes trailing slashes and ensures the '/api' prefix is present.
 */
export const resolveBaseUrl = () => {
  let url =
    import.meta.env.VITE_API_URL ||
    import.meta.env.REACT_APP_API_URL ||
    import.meta.env.VITE_BACKEND_URL;

  if (!url || typeof url !== 'string' || !url.trim()) {
    if (import.meta.env.DEV) {
      return '/api';
    }
    // In production without env variable:
    if (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ) {
      return 'http://localhost:5000/api';
    }

    // In production, default directly to your deployed Render backend
    return 'https://job-portal-1how-to-deploy.onrender.com/api';
  }

  // Clean trailing slashes
  url = url.trim().replace(/\/+$/, '');

  // Ensure '/api' suffix is present without doubling
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }

  return url;
};

export const API_BASE_URL = resolveBaseUrl();

const API = axios.create({
  baseURL: API_BASE_URL,
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

// Response interceptor: handle 401s and detect SPA HTML fallback
API.interceptors.response.use(
  (response) => {
    // Check if the response returned an HTML document (SPA fallback) instead of JSON
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!DOCTYPE html>') ||
        response.data.includes('<html') ||
        response.data.includes('<head>'))
    ) {
      console.error(
        `[JobConnect API Error] Endpoint "${response.config.url}" returned HTML instead of JSON. ` +
        `This occurs when the production frontend calls a relative route that gets intercepted by the SPA static router. ` +
        `Please ensure VITE_API_URL is configured in your production deployment dashboard.`
      );
      return Promise.reject(
        new Error(
          `API endpoint "${response.config.url}" returned HTML instead of JSON. Please verify VITE_API_URL in deployment settings.`
        )
      );
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
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

/**
 * Helper to resolve media/image URLs (handles relative /uploads/ vs full https:// URLs).
 * Dynamically derives backend origin from API_BASE_URL if VITE_BACKEND_URL is not set.
 */
export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  let backendBase = import.meta.env.VITE_BACKEND_URL;
  if (!backendBase || typeof backendBase !== 'string') {
    if (API_BASE_URL.startsWith('http://') || API_BASE_URL.startsWith('https://')) {
      backendBase = API_BASE_URL.replace(/\/api\/?$/, '');
    } else if (import.meta.env.DEV) {
      backendBase = 'http://localhost:5000';
    } else {
      backendBase = '';
    }
  } else {
    backendBase = backendBase.trim().replace(/\/+$/, '');
  }

  return `${backendBase}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default API;
