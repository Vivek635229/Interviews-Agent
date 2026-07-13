// ═══════════════════════════════════════════════════════════════
// Resume Model — PDF metadata + extracted content + analysis
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    extractedText: {
      type: String,
      default: '',
    },
    atsScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    skills: [
      {
        name: String,
        strength: { type: String, enum: ['strong', 'moderate', 'weak'] },
        mentions: { type: Number, default: 1 },
      },
    ],
    missingSkills: [
      {
        name: String,
        importance: { type: String, enum: ['high', 'medium', 'low'] },
        reason: String,
      },
    ],
    improvements: [
      {
        category: String,
        title: String,
        description: String,
        priority: { type: String, enum: ['high', 'medium', 'low'] },
        icon: String,
      },
    ],
    scoreBreakdown: [
      {
        label: String,
        score: { type: Number, min: 0, max: 100 },
      },
    ],
    summary: {
      type: String,
      default: '',
    },
    analysis: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isAnalyzed: {
      type: Boolean,
      default: false,
    },
    storageType: {
      type: String,
      enum: ['local', 'ibm-cos'],
      default: 'local',
    },
  },
  {
    timestamps: true,
  }
);

resumeSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
