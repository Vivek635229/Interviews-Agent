// ═══════════════════════════════════════════════════════════════
// Report Routes
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { getReport, getUserReports, getDashboardStats } = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const validators = require('../utils/validators');

// All report routes are protected
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/', getUserReports);
router.get('/:id', validators.mongoId, validate, getReport);

module.exports = router;
