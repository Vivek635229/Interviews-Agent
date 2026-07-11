// ═══════════════════════════════════════════════════════════════
// Validation Middleware — Runs express-validator and returns errors
// ═══════════════════════════════════════════════════════════════

const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
};

module.exports = validate;
