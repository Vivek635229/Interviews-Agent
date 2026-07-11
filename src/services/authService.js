// ═══════════════════════════════════════════════════════════════
// Auth Service — Register, Login, Logout, Refresh, Change Password
// ═══════════════════════════════════════════════════════════════

import api from './api';

const authService = {
  async register({ name, email, password }) {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  },

  async login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async logout() {
    const { data } = await api.post('/auth/logout');
    return data;
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data;
  },

  async changePassword({ currentPassword, newPassword }) {
    const { data } = await api.put('/user/change-password', {
      currentPassword,
      newPassword,
    });
    return data;
  },
};

export default authService;
