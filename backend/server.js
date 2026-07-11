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
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const corsOptions = require('./config/cors');
const { connectDB, disconnectDB } = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter.middleware');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const { initializeRAG } = require('./rag/pipeline');
const logger = require('./utils/logger');

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

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// ── Logging ──
if (env.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ── Rate Limiting ──
app.use('/api/', apiLimiter);

// ── Ensure uploads directory exists ──
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
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
    const server = app.listen(env.PORT, () => {
      logger.info('═══════════════════════════════════════════════');
      logger.info(`🚀 Server running on port ${env.PORT}`);
      logger.info(`📍 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 API: http://localhost:${env.PORT}/api/v1`);
      logger.info(`🤖 IBM watsonx.ai: ${env.hasIBM ? 'Configured' : 'Not configured (using mocks)'}`);
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

startServer();

module.exports = app;
