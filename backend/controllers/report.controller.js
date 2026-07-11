// ═══════════════════════════════════════════════════════════════
// Report Controller — Fetch generated reports + Dashboard stats
// ═══════════════════════════════════════════════════════════════

const InterviewReport = require('../models/InterviewReport.model');
const InterviewSession = require('../models/InterviewSession.model');
const Resume = require('../models/Resume.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /report/:id
 */
const getReport = catchAsync(async (req, res) => {
  const report = await InterviewReport.findOne({
    _id: req.params.id,
    userId: req.user._id,
  }).populate('sessionId');

  if (!report) throw AppError.notFound('Report not found.');

  res.status(200).json({
    status: 'success',
    data: { report },
  });
});

/**
 * GET /report/
 */
const getUserReports = catchAsync(async (req, res) => {
  const reports = await InterviewReport.find({ userId: req.user._id })
    .sort('-createdAt')
    .limit(50)
    .lean();

  res.status(200).json({
    status: 'success',
    results: reports.length,
    data: { reports },
  });
});

/**
 * GET /report/stats — Dashboard aggregation
 */
const getDashboardStats = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Aggregate interview data
  const sessions = await InterviewSession.find({ userId })
    .sort('-createdAt')
    .lean();

  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const totalInterviews = completedSessions.length;

  // Average score from completed sessions
  const avgScore = totalInterviews > 0
    ? Math.round(completedSessions.reduce((sum, s) => sum + (s.score || 0), 0) / totalInterviews)
    : 0;

  // Best score
  const bestScore = totalInterviews > 0
    ? Math.max(...completedSessions.map((s) => s.score || 0))
    : 0;

  // Total practice hours
  const totalSeconds = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const practiceHours = Math.round((totalSeconds / 3600) * 10) / 10;

  // Get latest resume ATS score
  const latestResume = await Resume.findOne({ userId, isAnalyzed: true })
    .sort('-createdAt')
    .lean();
  const resumeScore = latestResume?.atsScore || 0;

  // Reports for performance over time
  const reports = await InterviewReport.find({ userId })
    .sort('createdAt')
    .lean();

  // Build performance timeline (group by month)
  const performanceOverTime = [];
  const monthMap = {};
  for (const report of reports) {
    const date = new Date(report.createdAt);
    const monthKey = date.toLocaleString('en-US', { month: 'short' });
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { total: 0, count: 0 };
    }
    monthMap[monthKey].total += report.overallScore;
    monthMap[monthKey].count += 1;
  }
  for (const [month, data] of Object.entries(monthMap)) {
    performanceOverTime.push({
      month,
      score: Math.round(data.total / data.count),
    });
  }

  // Category scores from latest reports
  const categoryMap = {};
  for (const report of reports.slice(-10)) {
    for (const cat of (report.categoryScores || [])) {
      if (!categoryMap[cat.category]) {
        categoryMap[cat.category] = { total: 0, count: 0 };
      }
      categoryMap[cat.category].total += cat.score;
      categoryMap[cat.category].count += 1;
    }
  }
  const categoryScores = Object.entries(categoryMap).map(([category, data]) => ({
    category,
    score: Math.round(data.total / data.count),
  }));

  // Recent interviews (last 5)
  const recentInterviews = completedSessions.slice(0, 5).map((s) => ({
    id: s._id,
    role: s.role,
    company: s.company,
    date: s.completedAt || s.createdAt,
    score: s.score,
    status: s.status,
    duration: s.duration ? `${Math.round(s.duration / 60)} min` : 'N/A',
    questions: s.totalQuestions,
  }));

  res.status(200).json({
    status: 'success',
    data: {
      stats: [
        { id: 1, label: 'Interviews Completed', value: totalInterviews, icon: 'bi-chat-dots', trend: '', trendUp: true },
        { id: 2, label: 'Resume Score', value: resumeScore, icon: 'bi-file-earmark-check', suffix: '%', trend: '', trendUp: true },
        { id: 3, label: 'Avg. Performance', value: avgScore, icon: 'bi-graph-up-arrow', suffix: '%', trend: '', trendUp: true },
        { id: 4, label: 'Practice Hours', value: practiceHours, icon: 'bi-clock', suffix: 'h', trend: '', trendUp: true },
      ],
      recentInterviews,
      performanceOverTime,
      categoryScores,
      bestScore,
    },
  });
});

module.exports = { getReport, getUserReports, getDashboardStats };
