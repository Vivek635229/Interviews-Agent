// ═══════════════════════════════════════════════════════════════
// Error Middleware — Centralized error handler
// ═══════════════════════════════════════════════════════════════

const logger = require('../utils/logger');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let status = err.status || 'error';

  // ── Mongoose CastError (invalid ObjectId) ──
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    status = 'fail';
  }

  // ── Mongoose Validation Error ──
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = `Validation failed: ${errors.join(', ')}`;
    status = 'fail';
  }

  // ── Mongoose Duplicate Key ──
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists.`;
    status = 'fail';
  }

  // ── JWT Errors ──
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
    status = 'fail';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please refresh your session.';
    status = 'fail';
  }

  // ── Multer Errors ──
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File too large. Maximum size is 5MB.';
    status = 'fail';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file field.';
    status = 'fail';
  }

  // Log error
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, env.isDev ? err.stack : '');
  } else {
    logger.warn(`${statusCode} - ${message}`);
  }

  // Response
  const response = {
    status,
    message,
    ...(env.isDev && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

// 404 handler for undefined routes
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} not found`,
  });
};

module.exports = { errorHandler, notFoundHandler };
