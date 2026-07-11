// ═══════════════════════════════════════════════════════════════
// Upload Middleware — Multer for PDF resume uploads
// ═══════════════════════════════════════════════════════════════

const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const env = require('../config/env');
const AppError = require('../utils/AppError');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    const ext = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

// File filter — PDF only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new AppError('Only PDF files are allowed.', 400), false);
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE, // 5MB default
    files: 1,
  },
});

// Single file upload middleware
const uploadResume = upload.single('resume');

// Error-wrapped version
const handleUpload = (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(AppError.badRequest('File too large. Maximum size is 5MB.'));
      }
      return next(AppError.badRequest(err.message));
    }
    if (err) {
      return next(err);
    }
    if (!req.file) {
      return next(AppError.badRequest('No file uploaded. Please select a PDF file.'));
    }
    next();
  });
};

module.exports = { handleUpload };
