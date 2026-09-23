import axios from 'axios';

const PRODUCTION_BACKEND_URL = 'https://job-portal-1how-to-deploy.onrender.com';
const PRODUCTION_API_URL = `${PRODUCTION_BACKEND_URL}/api`;

/**
 * Intelligently resolve the backend API Base URL across development and production deployments.
 * Evaluates browser runtime host to guarantee deployed clients connect directly to Render.
 */
export const resolveBaseUrl = () => {
  // If running in the browser:
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.local');

    // On local development machine
    if (isLocalhost) {
      const devUrl =
        import.meta.env.VITE_API_URL ||
        import.meta.env.REACT_APP_API_URL ||
        import.meta.env.VITE_BACKEND_URL;

      if (devUrl && typeof devUrl === 'string' && devUrl.trim()) {
        let clean = devUrl.trim().replace(/\/+$/, '');
        if (!clean.endsWith('/api')) clean = `${clean}/api`;
        return clean;
      }
      return 'http://localhost:5000/api';
    }

    // On any deployed domain (*.vercel.app, custom domains, etc.):
    // Any localhost, 127.0.0.1, relative /api, or same-origin URL is invalid in production.
    const envUrl =
      import.meta.env.VITE_API_URL ||
      import.meta.env.REACT_APP_API_URL ||
      import.meta.env.VITE_BACKEND_URL;

    if (
      envUrl &&
      typeof envUrl === 'string' &&
      envUrl.startsWith('https://') &&
      !envUrl.includes('localhost') &&
      !envUrl.includes('127.0.0.1') &&
      !envUrl.includes(hostname)
    ) {
      let clean = envUrl.trim().replace(/\/+$/, '');
      if (!clean.endsWith('/api')) clean = `${clean}/api`;
      return clean;
    }

    // Default directly to your deployed Render backend
    return PRODUCTION_API_URL;
  }

  // Fallback for build-time or SSR
  return PRODUCTION_API_URL;
};

export const API_BASE_URL = resolveBaseUrl();

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor: ensure correct baseURL and attach JWT token
API.interceptors.request.use(
  (config) => {
    // Dynamic runtime check: if deployed, ensure request points to production backend
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocalhost =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0' ||
        hostname.endsWith('.local');

      if (!isLocalhost) {
        if (
          !config.baseURL ||
          config.baseURL === '/api' ||
          config.baseURL.includes('localhost') ||
          config.baseURL.includes('127.0.0.1') ||
          config.baseURL.includes(hostname)
        ) {
          config.baseURL = PRODUCTION_API_URL;
        }
      }
    }

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
        `Please ensure requests point to the production backend: ${PRODUCTION_API_URL}`
      );
      return Promise.reject(
        new Error(
          `API endpoint "${response.config.url}" returned HTML instead of JSON. Please verify backend connection.`
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
 * Dynamically resolves to production Render backend origin on deployed sites.
 */
export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  let backendBase = '';
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.local');

    if (isLocalhost) {
      const devBase = import.meta.env.VITE_BACKEND_URL;
      backendBase = devBase && typeof devBase === 'string' ? devBase.trim().replace(/\/+$/, '') : 'http://localhost:5000';
    } else {
      backendBase = PRODUCTION_BACKEND_URL;
    }
  } else {
    backendBase = PRODUCTION_BACKEND_URL;
  }

  return `${backendBase}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default API;
