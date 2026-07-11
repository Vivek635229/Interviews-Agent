// ═══════════════════════════════════════════════════════════════
// Auth Middleware — JWT verification for protected routes
// ═══════════════════════════════════════════════════════════════

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const tokenManager = require('../utils/tokenManager');
const User = require('../models/User.model');

/**
 * Protect route — requires valid JWT
 */
const protect = catchAsync(async (req, res, next) => {
  const token = tokenManager.extractFromHeader(req.headers.authorization);

  if (!token) {
    throw AppError.unauthorized('Access token is required. Please log in.');
  }

  let decoded;
  try {
    decoded = tokenManager.verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw AppError.unauthorized('Token expired. Please refresh your token.');
    }
    throw AppError.unauthorized('Invalid token. Please log in again.');
  }

  // Attach user to request (exclude password)
  const user = await User.findById(decoded.id).select('-password -refreshToken');
  if (!user) {
    throw AppError.unauthorized('User no longer exists.');
  }

  req.user = user;
  next();
});

/**
 * Optional auth — attaches user if token present, continues otherwise
 */
const optionalAuth = catchAsync(async (req, res, next) => {
  const token = tokenManager.extractFromHeader(req.headers.authorization);

  if (token) {
    try {
      const decoded = tokenManager.verifyAccessToken(token);
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
    } catch {
      // Token invalid — continue without user
    }
  }

  next();
});

module.exports = { protect, optionalAuth };
