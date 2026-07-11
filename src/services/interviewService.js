// ═══════════════════════════════════════════════════════════════
// Interview Service — Start, answer, evaluate, complete
// ═══════════════════════════════════════════════════════════════

import api from './api';

const interviewService = {
  async startInterview({ type, difficulty, role, company, resumeId }) {
    const { data } = await api.post('/interview/start', {
      type,
      difficulty,
      role,
      company,
      resumeId,
    });
    return data;
  },

  async getNextQuestion(sessionId) {
    const { data } = await api.post('/interview/next', { sessionId });
    return data;
  },

  async evaluateAnswer({ sessionId, questionId, answer }) {
    const { data } = await api.post('/interview/evaluate', {
      sessionId,
      questionId,
      answer,
    });
    return data;
  },

  async completeInterview(sessionId) {
    const { data } = await api.post('/interview/complete', { sessionId });
    return data;
  },

  async getHistory() {
    const { data } = await api.get('/interview/history');
    return data;
  },
};

export default interviewService;
