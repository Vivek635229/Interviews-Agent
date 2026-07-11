// ═══════════════════════════════════════════════════════════════
// MongoDB Connection — Mongoose with retry logic and validation
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

let connectionRetries = 0;
const MAX_RETRIES = 5;

/**
 * Connect to MongoDB with strictQuery and retry limits
 */
const connectDB = async () => {
  try {
    // Configure Mongoose strictQuery (recommended for modern Mongoose)
    mongoose.set('strictQuery', false);

    logger.info('Connecting to MongoDB Atlas...');
    
    // Attempt Mongoose connection
    const conn = await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    // Success logs as required
    logger.info('✅ MongoDB Connected Successfully');
    logger.info(`Host: ${conn.connection.host}`);
    logger.info(`Database Name: ${conn.connection.name}`);

    // Connection event listeners for runtime connection monitoring
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting reconnection...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected.');
    });

    // Reset retry counter on successful connection
    connectionRetries = 0;

    return conn;
  } catch (error) {
    connectionRetries += 1;
    logger.error(`❌ MongoDB connection failed (Attempt ${connectionRetries}/${MAX_RETRIES}): ${error.message}`);
    
    if (connectionRetries >= MAX_RETRIES) {
      logger.error('❌ Max MongoDB connection retries reached. Database is down or credentials/network issue.');
      // Re-throw to let server.js catch this and log the exit condition
      throw error;
    }

    logger.info('Retrying connection in 5 seconds...');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return connectDB();
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected gracefully.');
};

module.exports = { connectDB, disconnectDB };
