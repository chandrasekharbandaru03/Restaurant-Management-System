import api from './axios';

export const authApi = {
  login: async (email, password) => {
    const response = await api.post('/api/v1/auth/login', { email, password });
    return response.data; // { token, tokenType, userId, email, role }
  },

  register: async (email, password) => {
    const response = await api.post('/api/v1/auth/register', { email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/v1/auth/me');
    return response.data;
  }
};

