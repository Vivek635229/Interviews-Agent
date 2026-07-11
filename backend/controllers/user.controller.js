// ═══════════════════════════════════════════════════════════════
// User Controller — Profile management
// ═══════════════════════════════════════════════════════════════

const User = require('../models/User.model');
const Resume = require('../models/Resume.model');
const Interview = require('../models/Interview.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /user/profile
 */
const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw AppError.notFound('User not found.');

  res.status(200).json({
    status: 'success',
    data: { user: user.toSafeJSON() },
  });
});

/**
 * PUT /user/profile
 */
const updateProfile = catchAsync(async (req, res) => {
  // Prevent password updates through this route
  if (req.body.password) {
    throw AppError.badRequest('Use /auth/change-password to update your password.');
  }

  const allowedFields = ['name', 'email', 'title', 'avatar', 'preferences'];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) throw AppError.notFound('User not found.');

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: { user: user.toSafeJSON() },
  });
});

/**
 * PUT /user/change-password
 */
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw AppError.badRequest('Current password and new password are required.');
  }

  if (newPassword.length < 8) {
    throw AppError.badRequest('New password must be at least 8 characters.');
  }

  // Get user with password field
  const user = await User.findById(req.user._id).select('+password');
  if (!user) throw AppError.notFound('User not found.');

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw AppError.unauthorized('Current password is incorrect.');
  }

  // Update password (pre-save hook will hash it)
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully',
  });
});

/**
 * DELETE /user/account
 */
const deleteAccount = catchAsync(async (req, res) => {
  // Cascade delete associated data
  await Resume.deleteMany({ userId: req.user._id });
  await Interview.deleteMany({ userId: req.user._id });

  await User.findByIdAndDelete(req.user._id);

  // Clear cookies
  res.clearCookie('refreshToken');

  res.status(200).json({
    status: 'success',
    message: 'Account deleted successfully',
  });
});

module.exports = { getProfile, updateProfile, changePassword, deleteAccount };
