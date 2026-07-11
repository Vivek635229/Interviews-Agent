// ═══════════════════════════════════════════════════════════════
// User Routes
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, deleteAccount } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const validators = require('../utils/validators');

// All user routes are protected
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', validators.updateProfile, validate, updateProfile);
router.put('/change-password', changePassword);
router.delete('/account', deleteAccount);

module.exports = router;
