// ═══════════════════════════════════════════════════════════════
// Report Service — Reports + Dashboard Stats
// ═══════════════════════════════════════════════════════════════

import api from './api';

const reportService = {
  async getUserReports() {
    const { data } = await api.get('/report');
    return data;
  },

  async getReport(id) {
    const { data } = await api.get(`/report/${id}`);
    return data;
  },

  async getDashboardStats() {
    const { data } = await api.get('/report/stats');
    return data;
  },
};

export default reportService;
