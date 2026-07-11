// ═══════════════════════════════════════════════════════════════
// RAG Text Chunker — Splits documents into overlapping chunks
// ═══════════════════════════════════════════════════════════════

const logger = require('../utils/logger');

/**
 * Chunk text into overlapping segments
 * @param {string} text - The text to chunk
 * @param {Object} options
 * @param {number} options.chunkSize - Max characters per chunk (default: 500)
 * @param {number} options.overlap - Overlap between chunks (default: 100)
 * @returns {Array<{text: string, index: number, metadata: Object}>}
 */
const chunkText = (text, options = {}) => {
  const { chunkSize = 500, overlap = 100 } = options;
  const chunks = [];

  if (!text || text.length === 0) return chunks;

  // Split by paragraphs first, then by sentences
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = '';
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed chunk size
    if (currentChunk.length + paragraph.length > chunkSize && currentChunk.length > 0) {
      // Save current chunk
      chunks.push({
        text: currentChunk.trim(),
        index: chunkIndex++,
        metadata: { charCount: currentChunk.trim().length },
      });

      // Start new chunk with overlap from previous
      const overlapText = currentChunk.slice(-overlap);
      currentChunk = overlapText + ' ' + paragraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }

  // Don't forget the last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      text: currentChunk.trim(),
      index: chunkIndex,
      metadata: { charCount: currentChunk.trim().length },
    });
  }

  // If any chunk is still too large, split by sentences
  const finalChunks = [];
  for (const chunk of chunks) {
    if (chunk.text.length > chunkSize * 1.5) {
      const subChunks = splitBySentence(chunk.text, chunkSize, overlap);
      subChunks.forEach((sc, i) => {
        finalChunks.push({
          text: sc,
          index: finalChunks.length,
          metadata: { charCount: sc.length },
        });
      });
    } else {
      finalChunks.push({ ...chunk, index: finalChunks.length });
    }
  }

  logger.debug(`Chunked text into ${finalChunks.length} chunks (size: ${chunkSize}, overlap: ${overlap})`);
  return finalChunks;
};

/**
 * Split text by sentences when paragraph splitting isn't enough
 */
function splitBySentence(text, chunkSize, overlap) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks = [];
  let current = '';

  for (const sentence of sentences) {
    if (current.length + sentence.length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      const overlapText = current.slice(-overlap);
      current = overlapText + sentence;
    } else {
      current += sentence;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/**
 * Chunk a document object
 */
const chunkDocument = (document, options = {}) => {
  const chunks = chunkText(document.content, options);
  return chunks.map((chunk) => ({
    ...chunk,
    metadata: {
      ...chunk.metadata,
      title: document.title,
      source: document.source,
      category: document.category,
    },
  }));
};

module.exports = { chunkText, chunkDocument };
