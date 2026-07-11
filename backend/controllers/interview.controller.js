// ═══════════════════════════════════════════════════════════════
// Interview Controller — Start, answer, evaluate, complete
// ═══════════════════════════════════════════════════════════════

const InterviewSession = require('../models/InterviewSession.model');
const InterviewQuestion = require('../models/InterviewQuestion.model');
const InterviewAnswer = require('../models/InterviewAnswer.model');
const Resume = require('../models/Resume.model');
const interviewService = require('../services/interview.service');
const reportService = require('../services/report.service');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * POST /interview/start
 */
const startInterview = catchAsync(async (req, res) => {
  const { type, difficulty = 'medium', role = 'Software Developer', company = '', resumeId } = req.body;

  // Get resume text if resume-based
  let resumeText = '';
  if (resumeId) {
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (resume) resumeText = resume.extractedText || '';
  }

  // Create session
  const session = await InterviewSession.create({
    userId: req.user._id,
    resumeId: resumeId || undefined,
    type,
    difficulty,
    role,
    company,
    status: 'active',
    startedAt: new Date(),
  });

  // Generate questions using AI + RAG
  const questions = await interviewService.generateQuestions({
    type, role, difficulty, company, resumeText,
  });

  // Save questions to DB
  const savedQuestions = await InterviewQuestion.insertMany(
    questions.map((q) => ({
      sessionId: session._id,
      questionNumber: q.questionNumber,
      question: q.question,
      category: q.category,
      difficulty: q.difficulty,
      expectedTopics: q.expectedTopics,
    }))
  );

  session.totalQuestions = savedQuestions.length;
  session.currentQuestion = 1;
  await session.save();

  // Return first question
  const firstQuestion = savedQuestions[0];

  res.status(201).json({
    status: 'success',
    message: 'Interview started',
    data: {
      session: {
        id: session._id,
        type: session.type,
        difficulty: session.difficulty,
        role: session.role,
        company: session.company,
        totalQuestions: session.totalQuestions,
        currentQuestion: 1,
      },
      question: {
        id: firstQuestion._id,
        questionNumber: firstQuestion.questionNumber,
        question: firstQuestion.question,
        category: firstQuestion.category,
        difficulty: firstQuestion.difficulty,
      },
    },
  });
});

/**
 * POST /interview/next
 */
const getNextQuestion = catchAsync(async (req, res) => {
  const { sessionId } = req.body;

  const session = await InterviewSession.findOne({
    _id: sessionId,
    userId: req.user._id,
    status: 'active',
  });

  if (!session) throw AppError.notFound('Active session not found.');

  const nextNumber = session.currentQuestion + 1;

  if (nextNumber > session.totalQuestions) {
    return res.status(200).json({
      status: 'success',
      message: 'All questions answered. Complete the interview to generate your report.',
      data: { isComplete: true, sessionId: session._id },
    });
  }

  const question = await InterviewQuestion.findOne({
    sessionId: session._id,
    questionNumber: nextNumber,
  });

  if (!question) throw AppError.notFound('Next question not found.');

  session.currentQuestion = nextNumber;
  await session.save();

  res.status(200).json({
    status: 'success',
    data: {
      question: {
        id: question._id,
        questionNumber: question.questionNumber,
        question: question.question,
        category: question.category,
        difficulty: question.difficulty,
      },
      progress: {
        current: nextNumber,
        total: session.totalQuestions,
      },
      isComplete: false,
    },
  });
});

/**
 * POST /interview/evaluate
 */
const evaluateAnswer = catchAsync(async (req, res) => {
  const { sessionId, questionId, answer } = req.body;

  // Verify session
  const session = await InterviewSession.findOne({
    _id: sessionId,
    userId: req.user._id,
    status: 'active',
  });
  if (!session) throw AppError.notFound('Active session not found.');

  // Get question
  const question = await InterviewQuestion.findOne({
    _id: questionId,
    sessionId,
  });
  if (!question) throw AppError.notFound('Question not found.');

  // Check for duplicate answer
  const existingAnswer = await InterviewAnswer.findOne({ questionId });
  if (existingAnswer) throw AppError.conflict('This question has already been answered.');

  // Evaluate using AI + RAG
  const evaluation = await interviewService.evaluateAnswer({
    question: question.question,
    answer,
    expectedTopics: question.expectedTopics,
    category: question.category,
    difficulty: question.difficulty,
  });

  // Save answer
  const savedAnswer = await InterviewAnswer.create({
    sessionId,
    questionId,
    answer,
    score: evaluation.score,
    feedback: evaluation.feedback,
    strengths: evaluation.strengths,
    improvements: evaluation.improvements,
  });

  res.status(200).json({
    status: 'success',
    data: {
      answer: {
        id: savedAnswer._id,
        score: savedAnswer.score,
        feedback: savedAnswer.feedback,
        strengths: savedAnswer.strengths,
        improvements: savedAnswer.improvements,
      },
    },
  });
});

/**
 * POST /interview/complete
 */
const completeInterview = catchAsync(async (req, res) => {
  const { sessionId } = req.body;

  const session = await InterviewSession.findOne({
    _id: sessionId,
    userId: req.user._id,
  });

  if (!session) throw AppError.notFound('Session not found.');

  if (session.status === 'completed') {
    throw AppError.badRequest('Interview is already completed.');
  }

  // Calculate duration
  session.duration = Math.round((Date.now() - session.startedAt.getTime()) / 1000);

  // Generate report
  const report = await reportService.generateReport(session._id);

  res.status(200).json({
    status: 'success',
    message: 'Interview completed! Report generated.',
    data: {
      report: {
        id: report._id,
        overallScore: report.overallScore,
        summary: report.summary,
        categoryScores: report.categoryScores,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
        recommendations: report.recommendations,
        duration: session.duration,
      },
    },
  });
});

/**
 * GET /interview/history
 */
const getHistory = catchAsync(async (req, res) => {
  const sessions = await InterviewSession.find({ userId: req.user._id })
    .sort('-createdAt')
    .limit(50)
    .lean();

  res.status(200).json({
    status: 'success',
    results: sessions.length,
    data: { sessions },
  });
});

module.exports = { startInterview, getNextQuestion, evaluateAnswer, completeInterview, getHistory };
