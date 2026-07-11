// ═══════════════════════════════════════════════════════════════
// Resume Service — Upload, fetch, analyze
// ═══════════════════════════════════════════════════════════════

import api from './api';

const resumeService = {
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);

    const { data } = await api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async getUserResumes() {
    const { data } = await api.get('/resume');
    return data;
  },

  async getResume(id) {
    const { data } = await api.get(`/resume/${id}`);
    return data;
  },

  async analyzeResume(id) {
    const { data } = await api.post(`/resume/${id}/analyze`);
    return data;
  },
};

export default resumeService;
