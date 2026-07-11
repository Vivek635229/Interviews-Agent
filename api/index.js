const app = require('../backend/server');
const { connectDB } = require('../backend/config/db');
const { initializeRAG } = require('../backend/rag/pipeline');

// Cache initialization promise to prevent multiple concurrent initializations
let initializationPromise = null;

const initialize = async () => {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      await connectDB();
      // On Vercel, this will re-run on cold starts.
      // In a real production scenario with high traffic on serverless,
      // you would want an external vector database (like Pinecone) instead of local memory.
      await initializeRAG();
    })();
  }
  return initializationPromise;
};

// Vercel Serverless Function entrypoint
module.exports = async (req, res) => {
  // Ensure DB and RAG are initialized before handling the request
  await initialize();
  
  // Pass the request to the Express app
  return app(req, res);
};
