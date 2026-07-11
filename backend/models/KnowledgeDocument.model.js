// ═══════════════════════════════════════════════════════════════
// Knowledge Document Model — RAG knowledge base
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const knowledgeDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: 'local',
    },
    content: {
      type: String,
      required: true,
    },
    chunks: [
      {
        text: String,
        index: Number,
        metadata: mongoose.Schema.Types.Mixed,
      },
    ],
    category: {
      type: String,
      default: 'general',
      enum: ['general', 'technical', 'behavioral', 'hr', 'company', 'resume'],
    },
    isProcessed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('KnowledgeDocument', knowledgeDocumentSchema);
