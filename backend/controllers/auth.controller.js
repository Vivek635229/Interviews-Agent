// ═══════════════════════════════════════════════════════════════
// Auth Controller — Register, Login, Refresh, Logout
// ═══════════════════════════════════════════════════════════════

const User = require('../models/User.model');
const tokenManager = require('../utils/tokenManager');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * POST /auth/register
 */
const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw AppError.conflict('Email already registered.');
  }

  // Create user
  const user = await User.create({ name, email, password });

  // Generate tokens
  const { accessToken, refreshToken } = tokenManager.generateTokenPair(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    status: 'success',
    message: 'Account created successfully',
    data: {
      user: user.toSafeJSON(),
      accessToken,
    },
  });
});

/**
 * POST /auth/login
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password field
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw AppError.unauthorized('Invalid email or password.');
  }

  // Generate tokens
  const { accessToken, refreshToken } = tokenManager.generateTokenPair(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    data: {
      user: user.toSafeJSON(),
      accessToken,
    },
  });
});

/**
 * POST /auth/refresh
 */
const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;

  if (!token) {
    throw AppError.unauthorized('Refresh token is required.');
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = tokenManager.verifyRefreshToken(token);
  } catch {
    throw AppError.unauthorized('Invalid or expired refresh token.');
  }

  // Find user and verify stored token matches
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw AppError.unauthorized('Invalid refresh token.');
  }

  // Generate new token pair
  const { accessToken, refreshToken: newRefreshToken } = tokenManager.generateTokenPair(user._id);

  // Update stored refresh token
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    data: { accessToken },
  });
});

/**
 * POST /auth/logout
 */
const logout = catchAsync(async (req, res) => {
  // Clear refresh token in DB
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
  }

  // Clear cookie
  res.clearCookie('refreshToken');

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

/**
 * POST /auth/forgot-password (placeholder)
 */
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists
    return res.status(200).json({
      status: 'success',
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  }

  // TODO: Implement email sending with reset token
  res.status(200).json({
    status: 'success',
    message: 'If an account with that email exists, a reset link has been sent.',
  });
});

/**
 * GET /auth/profile
 */
const profile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw AppError.notFound('User not found.');

  res.status(200).json({
    status: 'success',
    data: { user: user.toSafeJSON() },
  });
});

module.exports = { register, login, refreshToken, logout, forgotPassword, profile };
