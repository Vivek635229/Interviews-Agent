// ═══════════════════════════════════════════════════════════════
// RAG Retriever — Similarity search + context formatting
// ═══════════════════════════════════════════════════════════════

const vectorStore = require('./vectorStore');
const embeddingGenerator = require('./embeddings');
const logger = require('../utils/logger');

/**
 * Retrieve relevant context for a query
 * @param {string} query - The search query
 * @param {Object} options
 * @param {number} options.topK - Number of results (default: 5)
 * @param {string} options.category - Filter by category (optional)
 * @returns {Object} { context: string, sources: Array }
 */
const retrieve = (query, options = {}) => {
  const { topK = 5, category = null } = options;

  if (!vectorStore.isInitialized || vectorStore.size === 0) {
    logger.debug('Vector store empty — no context to retrieve');
    return { context: '', sources: [] };
  }

  // Generate query embedding
  const queryEmbedding = embeddingGenerator.embed(query);

  // Search for similar chunks
  let results = vectorStore.search(queryEmbedding, topK * 2); // Get extra for filtering

  // Filter by category if specified
  if (category) {
    results = results.filter((r) => r.metadata?.category === category);
  }

  // Take top-K after filtering
  results = results.slice(0, topK);

  if (results.length === 0) {
    return { context: '', sources: [] };
  }

  // Format context for prompt injection
  const context = results
    .map((r, i) => `[Source ${i + 1}: ${r.metadata?.title || 'Unknown'}]\n${r.text}`)
    .join('\n\n---\n\n');

  const sources = results.map((r) => ({
    title: r.metadata?.title || 'Unknown',
    score: r.score.toFixed(3),
    category: r.metadata?.category || 'general',
  }));

  logger.debug(`Retrieved ${results.length} chunks for query: "${query.substring(0, 50)}..."`);

  return { context, sources };
};

module.exports = { retrieve };
