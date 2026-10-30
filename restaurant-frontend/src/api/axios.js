import axios from 'axios';

// Base instance configured for restaurantservice (default 8081)
const api = axios.create({
  baseURL: import.meta.env.VITE_RESTAURANT_SERVICE_URL || 'http://localhost:8081',
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // If unauthorized on a protected route, token may be expired
      console.warn('API Authorization error:', error.response.status);
    }
    return Promise.reject(error);
  }
);

// Dedicated instance for orderservice (default 8082)
export const orderApiInstance = axios.create({
  baseURL: import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8082',
});

orderApiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

