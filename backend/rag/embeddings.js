// ═══════════════════════════════════════════════════════════════
// RAG Embeddings — TF-IDF based text vectorization
// ═══════════════════════════════════════════════════════════════
// Uses a lightweight TF-IDF approach for zero-dependency operation.
// Future-ready for IBM watsonx.ai embedding model upgrade.

const logger = require('../utils/logger');

/**
 * Simple TF-IDF based embedding generator
 * Generates sparse vectors from text for cosine similarity search
 */
class EmbeddingGenerator {
  constructor() {
    this.vocabulary = new Map(); // word -> index
    this.idf = new Map();       // word -> idf score
    this.vocabSize = 0;
    this.documentCount = 0;
  }

  /**
   * Build vocabulary and IDF scores from a corpus of texts
   */
  buildVocabulary(texts) {
    const documentFrequency = new Map();
    this.documentCount = texts.length;

    // Count document frequency for each term
    for (const text of texts) {
      const uniqueWords = new Set(this._tokenize(text));
      for (const word of uniqueWords) {
        documentFrequency.set(word, (documentFrequency.get(word) || 0) + 1);
      }
    }

    // Build vocabulary and IDF
    let index = 0;
    for (const [word, df] of documentFrequency) {
      this.vocabulary.set(word, index++);
      this.idf.set(word, Math.log(this.documentCount / (1 + df)));
    }
    this.vocabSize = index;

    logger.debug(`Built vocabulary: ${this.vocabSize} terms from ${this.documentCount} documents`);
  }

  /**
   * Generate embedding vector for a single text
   */
  embed(text) {
    const tokens = this._tokenize(text);
    const tf = new Map();

    // Calculate term frequency
    for (const token of tokens) {
      tf.set(token, (tf.get(token) || 0) + 1);
    }

    // Generate TF-IDF vector
    const vector = new Float32Array(this.vocabSize);
    for (const [word, count] of tf) {
      const idx = this.vocabulary.get(word);
      if (idx !== undefined) {
        const tfScore = count / tokens.length;
        const idfScore = this.idf.get(word) || 0;
        vector[idx] = tfScore * idfScore;
      }
    }

    // L2 normalize
    const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
    if (norm > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] /= norm;
      }
    }

    return vector;
  }

  /**
   * Generate embeddings for multiple texts
   */
  embedBatch(texts) {
    return texts.map((text) => this.embed(text));
  }

  /**
   * Tokenize text into lowercase words
   */
  _tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2); // Skip very short words
  }
}

// Singleton
const embeddingGenerator = new EmbeddingGenerator();

module.exports = embeddingGenerator;
