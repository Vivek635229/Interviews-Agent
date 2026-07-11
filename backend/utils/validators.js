// ═══════════════════════════════════════════════════════════════
// Validation Schemas — express-validator chains for all endpoints
// ═══════════════════════════════════════════════════════════════

const { body, param, query } = require('express-validator');

const validators = {
  // ── Auth ──
  register: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/\d/).withMessage('Password must contain a number'),
  ],

  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required'),
  ],

  // ── User ──
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('role')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Role must be under 100 characters'),
  ],

  // ── Interview ──
  startInterview: [
    body('type')
      .notEmpty().withMessage('Interview type is required')
      .isIn(['resume', 'hr', 'behavioral', 'technical', 'company', 'custom'])
      .withMessage('Invalid interview type'),
    body('difficulty')
      .optional()
      .isIn(['easy', 'medium', 'hard'])
      .withMessage('Difficulty must be easy, medium, or hard'),
    body('role')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Role must be under 100 characters'),
    body('company')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Company must be under 100 characters'),
    body('resumeId')
      .optional()
      .isMongoId().withMessage('Invalid resume ID'),
  ],

  evaluateAnswer: [
    body('sessionId')
      .notEmpty().withMessage('Session ID is required')
      .isMongoId().withMessage('Invalid session ID'),
    body('questionId')
      .notEmpty().withMessage('Question ID is required')
      .isMongoId().withMessage('Invalid question ID'),
    body('answer')
      .notEmpty().withMessage('Answer is required')
      .isLength({ min: 10 }).withMessage('Answer must be at least 10 characters'),
  ],

  // ── Params ──
  mongoId: [
    param('id')
      .isMongoId().withMessage('Invalid ID format'),
  ],
};

module.exports = validators;
