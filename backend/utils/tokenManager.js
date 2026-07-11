// ═══════════════════════════════════════════════════════════════
// JWT Token Manager — Access & Refresh token generation/verification
// ═══════════════════════════════════════════════════════════════

const jwt = require('jsonwebtoken');
const env = require('../config/env');

const tokenManager = {
  /**
   * Generate access token (short-lived)
   */
  generateAccessToken(userId) {
    return jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRY,
    });
  },

  /**
   * Generate refresh token (long-lived)
   */
  generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRY,
    });
  },

  /**
   * Generate both tokens
   */
  generateTokenPair(userId) {
    return {
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId),
    };
  },

  /**
   * Verify access token
   */
  verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
  },

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
  },

  /**
   * Extract token from Authorization header
   */
  extractFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  },
};

module.exports = tokenManager;
