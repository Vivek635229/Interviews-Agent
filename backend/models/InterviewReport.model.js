// ═══════════════════════════════════════════════════════════════
// Interview Report Model — Final session report
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const interviewReportSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewSession',
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    categoryScores: [
      {
        category: String,
        score: { type: Number, min: 0, max: 100 },
      },
    ],
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: '',
    },
    interviewType: String,
    difficulty: String,
    role: String,
    company: String,
    duration: Number,
    totalQuestions: Number,
    questionsAnswered: Number,
  },
  {
    timestamps: true,
  }
);

interviewReportSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('InterviewReport', interviewReportSchema);
