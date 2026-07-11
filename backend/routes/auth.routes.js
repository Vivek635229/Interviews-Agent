// ═══════════════════════════════════════════════════════════════
// Auth Routes
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, forgotPassword, profile } = require('../controllers/auth.controller');
const { updateProfile } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const validators = require('../utils/validators');
const { authLimiter } = require('../middleware/rateLimiter.middleware');

router.post('/register', authLimiter, validators.register, validate, register);
router.post('/login', authLimiter, validators.login, validate, login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.post('/forgot-password', authLimiter, forgotPassword);

router.get('/profile', protect, profile);
router.put('/profile', protect, validators.updateProfile, validate, updateProfile);

module.exports = router;
