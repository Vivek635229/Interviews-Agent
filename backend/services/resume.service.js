// ═══════════════════════════════════════════════════════════════
// Resume Service — PDF parsing + analysis orchestration
// ═══════════════════════════════════════════════════════════════

const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const ibmService = require('./ibm.service');
const resumePrompt = require('../prompts/resume.prompt');
const logger = require('../utils/logger');

const resumeService = {
  /**
   * Extract text from PDF file
   */
  async extractText(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new PDFParse({ data: dataBuffer });
      const result = await parser.getText();

      if (!result.text || result.text.trim().length < 50) {
        throw new Error('Could not extract sufficient text from PDF. The file may be image-based or corrupted.');
      }

      logger.info(`Extracted ${result.text.length} characters from PDF (${result.total} pages)`);

      return {
        text: result.text.trim(),
        pages: result.total,
        info: {},
      };
    } catch (error) {
      logger.error(`PDF extraction failed: ${error.message}`);
      throw error;
    }
  },

  /**
   * Analyze resume using IBM Granite
   */
  async analyzeResume(extractedText) {
    const prompt = resumePrompt.analyzeResume(extractedText);
    const analysis = await ibmService.analyzeResume(prompt);

    if (!analysis) {
      logger.warn('IBM analysis returned null — using defaults');
      return this._defaultAnalysis();
    }

    return {
      atsScore: analysis.atsScore || 0,
      summary: analysis.summary || '',
      skills: analysis.skills || [],
      missingSkills: analysis.missingSkills || [],
      improvements: analysis.improvements || [],
      scoreBreakdown: analysis.scoreBreakdown || [],
    };
  },

  /**
   * Default analysis when IBM is unavailable
   */
  _defaultAnalysis() {
    return {
      atsScore: 70,
      summary: 'Resume analysis is pending. Configure IBM watsonx.ai for AI-powered insights.',
      skills: [],
      missingSkills: [],
      improvements: [
        {
          category: 'Setup',
          title: 'AI Analysis Pending',
          description: 'Configure your IBM watsonx.ai API key to get detailed resume analysis.',
          priority: 'high',
          icon: 'bi-gear',
        },
      ],
      scoreBreakdown: [
        { label: 'Formatting', score: 70 },
        { label: 'Keywords', score: 70 },
        { label: 'Experience', score: 70 },
        { label: 'Skills Match', score: 70 },
        { label: 'Education', score: 70 },
        { label: 'Impact Statements', score: 70 },
      ],
    };
  },
};

module.exports = resumeService;
