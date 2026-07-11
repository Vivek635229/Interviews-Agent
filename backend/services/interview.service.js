// ═══════════════════════════════════════════════════════════════
// Interview Service — Interview flow orchestration
// ═══════════════════════════════════════════════════════════════

const ibmService = require('./ibm.service');
const interviewPrompt = require('../prompts/interview.prompt');
const behaviorPrompt = require('../prompts/behavior.prompt');
const technicalPrompt = require('../prompts/technical.prompt');
const companyPrompt = require('../prompts/company.prompt');
const feedbackPrompt = require('../prompts/feedback.prompt');
const { queryRAG } = require('../rag/pipeline');
const logger = require('../utils/logger');

const interviewService = {
  /**
   * Generate interview questions based on type
   */
  async generateQuestions({ type, role, difficulty, company, resumeText }) {
    // Retrieve RAG context
    const ragQuery = `${type} interview questions for ${role}${company ? ` at ${company}` : ''}`;
    const { context } = queryRAG(ragQuery, { topK: 3, category: this._mapTypeToCategory(type) });

    // Select prompt template based on type
    const promptData = { type, role, difficulty, company, resumeText, context };
    let prompt;

    switch (type) {
      case 'behavioral':
        prompt = behaviorPrompt.generateQuestions(promptData);
        break;
      case 'technical':
        prompt = technicalPrompt.generateQuestions(promptData);
        break;
      case 'company':
        prompt = companyPrompt.generateQuestions(promptData);
        break;
      default:
        prompt = interviewPrompt.generateQuestions(promptData);
    }

    const questions = await ibmService.generateInterview(prompt);

    if (!questions || !Array.isArray(questions)) {
      logger.warn('Failed to generate questions — using fallback');
      return this._fallbackQuestions(type, role, difficulty);
    }

    // Ensure we have exactly 10 questions
    return questions.slice(0, 10).map((q, i) => ({
      questionNumber: i + 1,
      question: q.question,
      category: q.category || 'General',
      difficulty: q.difficulty || difficulty,
      expectedTopics: q.expectedTopics || [],
    }));
  },

  /**
   * Evaluate a single answer
   */
  async evaluateAnswer({ question, answer, expectedTopics, category, difficulty }) {
    const { context } = queryRAG(`${category} ${question}`, { topK: 2 });

    const prompt = feedbackPrompt.evaluateAnswer({
      question,
      answer,
      expectedTopics: expectedTopics || [],
      category: category || 'General',
      difficulty: difficulty || 'medium',
      context,
    });

    const evaluation = await ibmService.evaluateAnswer(prompt);

    if (!evaluation) {
      return {
        score: 5,
        feedback: 'Unable to evaluate at this time. Please try again.',
        strengths: [],
        improvements: [],
      };
    }

    return {
      score: Math.min(10, Math.max(0, evaluation.score || 5)),
      feedback: evaluation.feedback || '',
      strengths: evaluation.strengths || [],
      improvements: evaluation.improvements || [],
    };
  },

  /**
   * Generate final interview report
   */
  async generateReport({ role, company, type, difficulty, questionsAndAnswers }) {
    const prompt = feedbackPrompt.generateReport({
      role,
      company,
      type,
      difficulty,
      questionsAndAnswers,
    });

    const report = await ibmService.generateFeedback(prompt);

    if (!report) {
      return this._fallbackReport(questionsAndAnswers);
    }

    return {
      overallScore: report.overallScore || 0,
      summary: report.summary || '',
      categoryScores: report.categoryScores || [],
      strengths: report.strengths || [],
      weaknesses: report.weaknesses || [],
      recommendations: report.recommendations || [],
    };
  },

  // ── Helpers ──

  _mapTypeToCategory(type) {
    const map = {
      behavioral: 'behavioral',
      technical: 'technical',
      hr: 'hr',
      company: 'company',
      resume: 'resume',
    };
    return map[type] || null;
  },

  _fallbackQuestions(type, role, difficulty) {
    const questions = [
      { question: 'Tell me about yourself and your experience.', category: 'Introduction', difficulty: 'easy', expectedTopics: ['Background', 'Experience', 'Goals'] },
      { question: 'What interests you most about this role?', category: 'Motivation', difficulty: 'easy', expectedTopics: ['Role alignment', 'Career goals', 'Company interest'] },
      { question: 'Describe a challenging project you worked on recently.', category: 'Behavioral', difficulty: 'medium', expectedTopics: ['Challenge', 'Approach', 'Outcome'] },
      { question: 'How do you stay updated with the latest technologies?', category: 'Professional Development', difficulty: 'easy', expectedTopics: ['Learning resources', 'Community', 'Practice'] },
      { question: 'Explain your approach to debugging a complex issue.', category: 'Technical', difficulty: 'medium', expectedTopics: ['Methodology', 'Tools', 'Systematic approach'] },
      { question: 'How do you prioritize tasks when working on multiple projects?', category: 'Time Management', difficulty: 'medium', expectedTopics: ['Prioritization', 'Communication', 'Organization'] },
      { question: 'Describe a time you received constructive criticism and how you handled it.', category: 'Behavioral', difficulty: 'medium', expectedTopics: ['Reception', 'Action taken', 'Growth'] },
      { question: 'What is your experience with agile/scrum methodologies?', category: 'Process', difficulty: 'medium', expectedTopics: ['Scrum roles', 'Sprint planning', 'Retrospectives'] },
      { question: 'How would you design a RESTful API for a todo application?', category: 'System Design', difficulty: 'hard', expectedTopics: ['Endpoints', 'Data model', 'Authentication', 'Error handling'] },
      { question: 'Where do you see yourself in the next 3-5 years?', category: 'Career', difficulty: 'easy', expectedTopics: ['Growth', 'Leadership', 'Skills development'] },
    ];

    return questions.map((q, i) => ({ ...q, questionNumber: i + 1 }));
  },

  _fallbackReport(questionsAndAnswers) {
    const scores = questionsAndAnswers.map((qa) => qa.score || 5);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    return {
      overallScore: Math.round(avg * 10),
      summary: `Interview completed with ${questionsAndAnswers.length} questions answered. Average score: ${avg.toFixed(1)}/10.`,
      categoryScores: [],
      strengths: ['Completed the full interview session'],
      weaknesses: ['Detailed analysis requires IBM watsonx.ai configuration'],
      recommendations: ['Configure IBM API key for detailed AI feedback'],
    };
  },
};

module.exports = interviewService;
