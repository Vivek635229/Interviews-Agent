// ═══════════════════════════════════════════════════════════════
// RAG Pipeline — Full Retrieval Augmented Generation workflow
// ═══════════════════════════════════════════════════════════════

const { loadDocuments } = require('./loader');
const { chunkDocument } = require('./chunker');
const embeddingGenerator = require('./embeddings');
const vectorStore = require('./vectorStore');
const { retrieve } = require('./retriever');
const logger = require('../utils/logger');

/**
 * Initialize the RAG pipeline — load, chunk, embed, store
 */
const initializeRAG = async () => {
  try {
    // Try loading from disk first
    if (vectorStore.load()) {
      logger.info(`🔍 RAG pipeline loaded from cache (${vectorStore.size} chunks)`);
      // Still need to rebuild vocabulary for query embedding
      const allTexts = vectorStore.entries.map((e) => e.text);
      if (allTexts.length > 0) {
        embeddingGenerator.buildVocabulary(allTexts);
      }
      return;
    }

    // Load documents
    const documents = loadDocuments();
    if (documents.length === 0) {
      logger.warn('No knowledge base documents found. RAG will return empty context.');
      return;
    }

    // Chunk all documents
    const allChunks = [];
    for (const doc of documents) {
      const chunks = chunkDocument(doc);
      allChunks.push(...chunks);
    }

    logger.info(`📄 Chunked ${documents.length} documents into ${allChunks.length} chunks`);

    // Build vocabulary from all chunk texts
    const texts = allChunks.map((c) => c.text);
    embeddingGenerator.buildVocabulary(texts);

    // Generate embeddings
    const embeddings = embeddingGenerator.embedBatch(texts);

    // Store in vector store
    const entries = allChunks.map((chunk, i) => ({
      text: chunk.text,
      embedding: embeddings[i],
      metadata: chunk.metadata,
    }));

    vectorStore.add(entries);
    vectorStore.save(); // Persist for next startup

    logger.info(`🔍 RAG pipeline initialized: ${vectorStore.size} chunks indexed`);
  } catch (error) {
    logger.error(`RAG initialization failed: ${error.message}`);
    logger.warn('Continuing without RAG — interviews will not use knowledge base context.');
  }
};

/**
 * Query the RAG pipeline — retrieve context for a prompt
 */
const queryRAG = (query, options = {}) => {
  return retrieve(query, options);
};

/**
 * Add a new document to the RAG pipeline at runtime
 */
const addDocument = (document) => {
  const chunks = chunkDocument(document);
  const texts = chunks.map((c) => c.text);

  // Rebuild vocabulary with new texts
  const existingTexts = vectorStore.entries.map((e) => e.text);
  embeddingGenerator.buildVocabulary([...existingTexts, ...texts]);

  // Re-embed everything (needed because vocabulary changed)
  // For large datasets, consider incremental updates
  const embeddings = embeddingGenerator.embedBatch(texts);

  const entries = chunks.map((chunk, i) => ({
    text: chunk.text,
    embedding: embeddings[i],
    metadata: chunk.metadata,
  }));

  vectorStore.add(entries);
  vectorStore.save();

  logger.info(`Added document "${document.title}" to RAG (${chunks.length} chunks)`);
};

module.exports = { initializeRAG, queryRAG, addDocument };
