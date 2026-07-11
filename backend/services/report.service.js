// ═══════════════════════════════════════════════════════════════
// Report Service — Compiles final interview reports
// ═══════════════════════════════════════════════════════════════

const InterviewSession = require('../models/InterviewSession.model');
const InterviewQuestion = require('../models/InterviewQuestion.model');
const InterviewAnswer = require('../models/InterviewAnswer.model');
const InterviewReport = require('../models/InterviewReport.model');
const interviewService = require('./interview.service');
const logger = require('../utils/logger');

const reportService = {
  /**
   * Generate and save a full interview report
   */
  async generateReport(sessionId) {
    // Fetch session with questions and answers
    const session = await InterviewSession.findById(sessionId);
    if (!session) throw new Error('Session not found');

    const questions = await InterviewQuestion.find({ sessionId }).sort('questionNumber');
    const answers = await InterviewAnswer.find({ sessionId });

    // Build Q&A pairs
    const questionsAndAnswers = questions.map((q) => {
      const answer = answers.find((a) => a.questionId.toString() === q._id.toString());
      return {
        question: q.question,
        answer: answer?.answer || 'Not answered',
        score: answer?.score || 0,
        category: q.category,
      };
    });

    // Generate AI report
    const aiReport = await interviewService.generateReport({
      role: session.role,
      company: session.company,
      type: session.type,
      difficulty: session.difficulty,
      questionsAndAnswers,
    });

    // Calculate overall score from individual answers
    const answeredCount = answers.length;
    const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
    const calculatedScore = answeredCount > 0 ? Math.round((totalScore / (answeredCount * 10)) * 100) : 0;

    // Save report
    const report = await InterviewReport.create({
      sessionId,
      userId: session.userId,
      overallScore: aiReport.overallScore || calculatedScore,
      categoryScores: aiReport.categoryScores || [],
      strengths: aiReport.strengths || [],
      weaknesses: aiReport.weaknesses || [],
      recommendations: aiReport.recommendations || [],
      summary: aiReport.summary || '',
      interviewType: session.type,
      difficulty: session.difficulty,
      role: session.role,
      company: session.company,
      duration: session.duration,
      totalQuestions: questions.length,
      questionsAnswered: answeredCount,
    });

    // Update session
    session.score = report.overallScore;
    session.status = 'completed';
    session.completedAt = new Date();
    await session.save();

    // Update user stats
    const User = require('../models/User.model');
    const user = await User.findById(session.userId);
    if (user) {
      user.stats.totalInterviews += 1;
      const allReports = await InterviewReport.find({ userId: user._id });
      const avgScore = allReports.reduce((sum, r) => sum + r.overallScore, 0) / allReports.length;
      user.stats.avgScore = Math.round(avgScore);
      user.stats.totalPracticeHours += Math.round(session.duration / 3600 * 10) / 10;
      await user.save();
    }

    logger.info(`Report generated for session ${sessionId}: score ${report.overallScore}`);
    return report;
  },
};

module.exports = reportService;
