// ═══════════════════════════════════════════════════════════════
// Custom Error Class — Operational errors with status codes
// ═══════════════════════════════════════════════════════════════

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Factory methods for common errors
AppError.badRequest = (msg = 'Bad request') => new AppError(msg, 400);
AppError.unauthorized = (msg = 'Unauthorized') => new AppError(msg, 401);
AppError.forbidden = (msg = 'Forbidden') => new AppError(msg, 403);
AppError.notFound = (msg = 'Not found') => new AppError(msg, 404);
AppError.conflict = (msg = 'Conflict') => new AppError(msg, 409);
AppError.tooMany = (msg = 'Too many requests') => new AppError(msg, 429);
AppError.internal = (msg = 'Internal server error') => new AppError(msg, 500);

module.exports = AppError;
