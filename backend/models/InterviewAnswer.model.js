// ═══════════════════════════════════════════════════════════════
// Interview Answer Model — User answer + AI evaluation
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const interviewAnswerSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewSession',
      required: true,
      index: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewQuestion',
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    answeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

interviewAnswerSchema.index({ sessionId: 1 });
interviewAnswerSchema.index({ questionId: 1 });

module.exports = mongoose.model('InterviewAnswer', interviewAnswerSchema);
