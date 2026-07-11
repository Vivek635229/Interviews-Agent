// ═══════════════════════════════════════════════════════════════
// RAG Document Loader — Reads knowledge base files
// ═══════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const KNOWLEDGE_BASE_DIR = path.join(__dirname, '..', 'knowledge-base');

/**
 * Load all documents from the knowledge base directory
 */
const loadDocuments = () => {
  const documents = [];

  if (!fs.existsSync(KNOWLEDGE_BASE_DIR)) {
    logger.warn(`Knowledge base directory not found: ${KNOWLEDGE_BASE_DIR}`);
    return documents;
  }

  const files = fs.readdirSync(KNOWLEDGE_BASE_DIR);
  const supportedExtensions = ['.txt', '.md'];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!supportedExtensions.includes(ext)) continue;

    try {
      const filePath = path.join(KNOWLEDGE_BASE_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      documents.push({
        title: path.basename(file, ext),
        source: filePath,
        content: content.trim(),
        category: detectCategory(file),
      });

      logger.debug(`Loaded knowledge document: ${file}`);
    } catch (error) {
      logger.error(`Failed to load ${file}: ${error.message}`);
    }
  }

  logger.info(`📚 Loaded ${documents.length} knowledge documents`);
  return documents;
};

/**
 * Load a single document from a file path
 */
const loadDocument = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const ext = path.extname(filePath);
  return {
    title: path.basename(filePath, ext),
    source: filePath,
    content: content.trim(),
    category: detectCategory(filePath),
  };
};

/**
 * Detect document category from filename
 */
function detectCategory(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('technical') || lower.includes('coding')) return 'technical';
  if (lower.includes('behavioral') || lower.includes('behavior')) return 'behavioral';
  if (lower.includes('hr') || lower.includes('human')) return 'hr';
  if (lower.includes('company') || lower.includes('culture')) return 'company';
  if (lower.includes('resume') || lower.includes('cv')) return 'resume';
  return 'general';
}

module.exports = { loadDocuments, loadDocument };
