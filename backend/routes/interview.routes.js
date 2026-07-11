// ═══════════════════════════════════════════════════════════════
// Interview Routes
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const {
  startInterview, getNextQuestion, evaluateAnswer,
  completeInterview, getHistory,
} = require('../controllers/interview.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const validators = require('../utils/validators');

// All interview routes are protected
router.use(protect);

router.post('/start', validators.startInterview, validate, startInterview);
router.post('/next', getNextQuestion);
router.post('/evaluate', validators.evaluateAnswer, validate, evaluateAnswer);
router.post('/complete', completeInterview);
router.get('/history', getHistory);

module.exports = router;
