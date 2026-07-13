// ═══════════════════════════════════════════════════════════════
// Interview Question Model
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewSession',
      required: true,
    },
    questionNumber: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'general',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    expectedTopics: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

interviewQuestionSchema.index({ sessionId: 1, questionNumber: 1 });

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);
