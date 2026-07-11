// ═══════════════════════════════════════════════════════════════
// User Service — Profile CRUD
// ═══════════════════════════════════════════════════════════════

import api from './api';

const userService = {
  async getProfile() {
    const { data } = await api.get('/user/profile');
    return data;
  },

  async updateProfile(updates) {
    const { data } = await api.put('/user/profile', updates);
    return data;
  },

  async deleteAccount() {
    const { data } = await api.delete('/user/account');
    return data;
  },
};

export default userService;
