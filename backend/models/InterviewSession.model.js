// ═══════════════════════════════════════════════════════════════
// Interview Session Model — Tracks a complete interview
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    type: {
      type: String,
      required: true,
      enum: ['resume', 'hr', 'behavioral', 'technical', 'company', 'custom'],
    },
    difficulty: {
      type: String,
      default: 'medium',
      enum: ['easy', 'medium', 'hard'],
    },
    role: {
      type: String,
      default: 'Software Developer',
      trim: true,
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'completed', 'abandoned'],
    },
    totalQuestions: {
      type: Number,
      default: 10,
    },
    currentQuestion: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number, // seconds
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: questions for this session
interviewSessionSchema.virtual('questions', {
  ref: 'InterviewQuestion',
  localField: '_id',
  foreignField: 'sessionId',
});

// Virtual: answers for this session
interviewSessionSchema.virtual('answers', {
  ref: 'InterviewAnswer',
  localField: '_id',
  foreignField: 'sessionId',
});

interviewSessionSchema.index({ userId: 1, createdAt: -1 });
interviewSessionSchema.index({ status: 1 });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
