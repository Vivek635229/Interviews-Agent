// ═══════════════════════════════════════════════════════════════
// RAG Vector Store — In-memory cosine similarity search
// ═══════════════════════════════════════════════════════════════
// Lightweight replacement for FAISS/Chroma.
// Persists to disk as JSON for reuse across restarts.

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const STORE_PATH = path.join(__dirname, '..', 'knowledge-base', '.vector-store.json');

class VectorStore {
  constructor() {
    this.entries = []; // { text, embedding, metadata }
    this.isInitialized = false;
  }

  /**
   * Add entries to the store
   * @param {Array<{text: string, embedding: Float32Array, metadata: Object}>} entries
   */
  add(entries) {
    for (const entry of entries) {
      this.entries.push({
        text: entry.text,
        embedding: Array.from(entry.embedding), // Convert to regular array for JSON
        metadata: entry.metadata || {},
      });
    }
    this.isInitialized = true;
    logger.debug(`Vector store: added ${entries.length} entries (total: ${this.entries.length})`);
  }

  /**
   * Search for most similar entries
   * @param {Float32Array} queryEmbedding
   * @param {number} topK
   * @returns {Array<{text: string, score: number, metadata: Object}>}
   */
  search(queryEmbedding, topK = 5) {
    if (this.entries.length === 0) return [];

    const queryArray = Array.from(queryEmbedding);

    const scored = this.entries.map((entry) => ({
      text: entry.text,
      metadata: entry.metadata,
      score: this._cosineSimilarity(queryArray, entry.embedding),
    }));

    // Sort by score descending and return top-K
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter((item) => item.score > 0.01); // Filter out near-zero matches
  }

  /**
   * Cosine similarity between two vectors
   */
  _cosineSimilarity(a, b) {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  /**
   * Save store to disk
   */
  save() {
    try {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(STORE_PATH, JSON.stringify({
        entries: this.entries,
        createdAt: new Date().toISOString(),
      }));
      logger.debug(`Vector store saved: ${this.entries.length} entries`);
    } catch (error) {
      logger.error(`Failed to save vector store: ${error.message}`);
    }
  }

  /**
   * Load store from disk
   */
  load() {
    try {
      if (!fs.existsSync(STORE_PATH)) return false;

      const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
      this.entries = data.entries || [];
      this.isInitialized = this.entries.length > 0;
      logger.debug(`Vector store loaded: ${this.entries.length} entries`);
      return true;
    } catch (error) {
      logger.error(`Failed to load vector store: ${error.message}`);
      return false;
    }
  }

  /**
   * Clear the store
   */
  clear() {
    this.entries = [];
    this.isInitialized = false;
    if (fs.existsSync(STORE_PATH)) fs.unlinkSync(STORE_PATH);
  }

  get size() {
    return this.entries.length;
  }
}

// Singleton
const vectorStore = new VectorStore();

module.exports = vectorStore;
