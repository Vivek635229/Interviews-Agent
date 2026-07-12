// ═══════════════════════════════════════════════════════════════
// AI Interview Trainer — Express Server Entry Point
// ═══════════════════════════════════════════════════════════════

// Load environment first (Crucial: loads dotenv before any other local imports)
const env = require('./config/env');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const corsOptions = require('./config/cors');
const { connectDB, disconnectDB } = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter.middleware');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const { initializeRAG } = require('./rag/pipeline');
const logger = require('./utils/logger');

// ── Custom Sanitization (Express 5 compatible) ──
// express-mongo-sanitize and xss-clean are incompatible with Express 5
// (req.query is read-only in Express 5)
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    // Strip basic XSS patterns
    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\$/g, '')
      .replace(/\.\./g, '');
  }
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      // Remove keys starting with $ (NoSQL injection)
      if (key.startsWith('$')) {
        delete value[key];
      } else {
        value[key] = sanitizeValue(value[key]);
      }
    }
  }
  return value;
};

const sanitizeMiddleware = (req, res, next) => {
  if (req.body) sanitizeValue(req.body);
  if (req.params) sanitizeValue(req.params);
  next();
};

// ── Initialize Express ──
const app = express();

// ── Security Middleware ──
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors(corsOptions));

// ── Request Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data Sanitization (NoSQL injection + XSS) — Express 5 compatible
app.use(sanitizeMiddleware);

// ── Logging ──
if (env.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ── Rate Limiting ──
app.use('/api/', apiLimiter);

// ── Ensure uploads directory exists ──
const uploadsDir = env.UPLOAD_PATH;
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  logger.warn(`Could not create uploads directory: ${err.message}`);
}

// ── Health Check ──
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AI Interview Trainer API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    ibmConfigured: env.hasIBM,
  });
});

// ── API Routes ──
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/user', require('./routes/user.routes'));
app.use('/api/v1/resume', require('./routes/resume.routes'));
app.use('/api/v1/interview', require('./routes/interview.routes'));
app.use('/api/v1/report', require('./routes/report.routes'));

// ── Serve Frontend in Production ──
if (env.isProd) {
  app.use(express.static(path.join(__dirname, '..', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running in development mode');
  });
}

// ── 404 Handler ──
app.use(notFoundHandler);

// ── Global Error Handler ──
app.use(errorHandler);

// ── Start Server ──
const startServer = async () => {
  try {
    // 1. Connect to MongoDB Atlas (with retry logic and verification)
    await connectDB();

    // 2. Initialize RAG pipeline
    await initializeRAG();

    // 3. Start listening
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, "0.0.0.0", () => {
      logger.info('═══════════════════════════════════════════════');
      logger.info(`✓ Server Running on port ${PORT}`);
      logger.info(`✓ Environment Loaded: ${env.NODE_ENV}`);
      logger.info(`✓ IBM Connected: ${env.hasIBM ? 'Yes' : 'No'}`);
      logger.info('═══════════════════════════════════════════════');
    });

    // ── Graceful Shutdown ──
    const gracefulShutdown = async (signal) => {
      logger.info(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        logger.info('Server closed.');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Unhandled rejections
    process.on('unhandledRejection', (err) => {
      logger.error(`Unhandled Rejection: ${err.message}`);
      if (env.isDev) console.error(err);
    });

    // Uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error(`Uncaught Exception: ${err.message}`);
      if (env.isDev) console.error(err);
      process.exit(1);
    });
  } catch (error) {
    // Exit the process ONLY after logging the actual error
    logger.error(`❌ Failed to start server: ${error.message}`);
    if (error.stack) {
      logger.error(error.stack);
    }
    process.exit(1);
  }
};

// Only start the server when run directly (e.g. `node backend/server.js`)
// When imported by Vercel serverless (api/index.js), skip app.listen()
if (require.main === module) {
  startServer();
}

module.exports = app;
