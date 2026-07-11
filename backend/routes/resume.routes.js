// ═══════════════════════════════════════════════════════════════
// Resume Routes
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { uploadResume, getUserResumes, getResume, analyzeResume } = require('../controllers/resume.controller');
const { protect } = require('../middleware/auth.middleware');
const { handleUpload } = require('../middleware/upload.middleware');
const validate = require('../middleware/validate.middleware');
const validators = require('../utils/validators');

// All resume routes are protected
router.use(protect);

router.post('/upload', handleUpload, uploadResume);
router.get('/', getUserResumes);
router.get('/:id', validators.mongoId, validate, getResume);
router.post('/:id/analyze', validators.mongoId, validate, analyzeResume);

module.exports = router;
