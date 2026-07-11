// ═══════════════════════════════════════════════════════════════
// Resume Controller — Upload, parse, analyze
// ═══════════════════════════════════════════════════════════════

const Resume = require('../models/Resume.model');
const resumeService = require('../services/resume.service');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * POST /resume/upload
 */
const uploadResume = catchAsync(async (req, res) => {
  const file = req.file;

  // Extract text from PDF
  const { text, pages } = await resumeService.extractText(file.path);

  // Create resume record
  const resume = await Resume.create({
    userId: req.user._id,
    fileName: file.filename,
    originalName: file.originalname,
    filePath: file.path,
    fileSize: file.size,
    mimeType: file.mimetype,
    extractedText: text,
  });

  res.status(201).json({
    status: 'success',
    message: 'Resume uploaded successfully',
    data: {
      resume: {
        id: resume._id,
        fileName: resume.originalName,
        fileSize: resume.fileSize,
        pages,
        textLength: text.length,
        isAnalyzed: false,
      },
    },
  });
});

/**
 * GET /resume/
 */
const getUserResumes = catchAsync(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id })
    .select('-extractedText -analysis')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: resumes.length,
    data: { resumes },
  });
});

/**
 * GET /resume/:id
 */
const getResume = catchAsync(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!resume) throw AppError.notFound('Resume not found.');

  res.status(200).json({
    status: 'success',
    data: { resume },
  });
});

/**
 * POST /resume/:id/analyze
 */
const analyzeResume = catchAsync(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!resume) throw AppError.notFound('Resume not found.');

  if (!resume.extractedText) {
    throw AppError.badRequest('No text extracted from resume. Please re-upload.');
  }

  // Run AI analysis
  const analysis = await resumeService.analyzeResume(resume.extractedText);

  // Update resume with analysis results
  resume.atsScore = analysis.atsScore;
  resume.summary = analysis.summary;
  resume.skills = analysis.skills;
  resume.missingSkills = analysis.missingSkills;
  resume.improvements = analysis.improvements;
  resume.scoreBreakdown = analysis.scoreBreakdown;
  resume.analysis = analysis;
  resume.isAnalyzed = true;
  await resume.save();

  res.status(200).json({
    status: 'success',
    message: 'Resume analyzed successfully',
    data: { resume },
  });
});

module.exports = { uploadResume, getUserResumes, getResume, analyzeResume };
