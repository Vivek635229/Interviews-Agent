// ═══════════════════════════════════════════════════════════════
// IBM watsonx.ai Service — Granite model integration
// ═══════════════════════════════════════════════════════════════

const env = require('../config/env');
const logger = require('../utils/logger');

class IBMService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = 0;
    this.apiKey = env.IBM_API_KEY;
    this.projectId = env.IBM_PROJECT_ID;
    this.authUrl = env.IBM_AUTH_URL;
    this.watsonxUrl = env.IBM_WATSONX_URL;
    this.modelId = env.IBM_MODEL_ID;
    this.maxRetries = 3;
  }

  // ── IAM Token Management ──

  /**
   * Get valid access token — caches and auto-refreshes
   */
  async getAccessToken() {
    // Return cached token if still valid (5 min buffer)
    if (this.accessToken && Date.now() < this.tokenExpiry - 300000) {
      return this.accessToken;
    }

    if (!this.apiKey) {
      logger.warn('IBM API key not configured. Using mock responses.');
      return null;
    }

    try {
      const response = await fetch(this.authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
          apikey: this.apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`IAM auth failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000;
      logger.info('✅ IBM IAM token refreshed');
      return this.accessToken;
    } catch (error) {
      logger.error(`IBM IAM auth error: ${error.message}`);
      return null;
    }
  }

  // ── Core Model Call ──

  /**
   * Call IBM Granite model with retry logic
   */
  async callGranite(prompt, params = {}) {
    const token = await this.getAccessToken();

    // If no token (IBM not configured), return mock
    if (!token) {
      return this._mockResponse(prompt);
    }

    const defaultParams = {
      max_new_tokens: 2048,
      temperature: 0.7,
      top_p: 0.9,
      repetition_penalty: 1.1,
      stop_sequences: [],
    };

    const body = {
      model_id: this.modelId,
      project_id: this.projectId,
      input: prompt,
      parameters: { ...defaultParams, ...params },
    };

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(this.watsonxUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Granite API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        const generatedText = data.results?.[0]?.generated_text?.trim();

        if (!generatedText) {
          throw new Error('Empty response from Granite model');
        }

        logger.debug(`Granite call success (attempt ${attempt})`);
        return generatedText;
      } catch (error) {
        logger.error(`Granite call failed (attempt ${attempt}/${this.maxRetries}): ${error.message}`);
        if (attempt === this.maxRetries) {
          logger.warn('All retries exhausted. Returning mock response.');
          return this._mockResponse(prompt);
        }
        // Exponential backoff
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }

  // ── High-level Methods ──

  /**
   * Generate interview questions
   */
  async generateInterview(prompt) {
    const result = await this.callGranite(prompt, {
      temperature: 0.7,
      max_new_tokens: 3000,
    });
    return this._parseJSON(result);
  }

  /**
   * Analyze resume
   */
  async analyzeResume(prompt) {
    const result = await this.callGranite(prompt, {
      temperature: 0.3,
      max_new_tokens: 3000,
    });
    return this._parseJSON(result);
  }

  /**
   * Evaluate an answer
   */
  async evaluateAnswer(prompt) {
    const result = await this.callGranite(prompt, {
      temperature: 0.4,
      max_new_tokens: 1000,
    });
    return this._parseJSON(result);
  }

  /**
   * Generate final report
   */
  async generateFeedback(prompt) {
    const result = await this.callGranite(prompt, {
      temperature: 0.5,
      max_new_tokens: 2000,
    });
    return this._parseJSON(result);
  }

  // ── Helpers ──

  /**
   * Parse JSON from model response — handles markdown code blocks
   */
  _parseJSON(text) {
    try {
      // Try direct parse
      return JSON.parse(text);
    } catch {
      try {
        // Try extracting JSON from markdown code blocks
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1].trim());
        }
        // Try finding JSON array or object
        const arrayMatch = text.match(/\[[\s\S]*\]/);
        const objectMatch = text.match(/\{[\s\S]*\}/);
        const match = arrayMatch || objectMatch;
        if (match) {
          return JSON.parse(match[0]);
        }
      } catch {
        // Fall through to error
      }
      logger.error('Failed to parse JSON from Granite response');
      logger.debug(`Raw response: ${text.substring(0, 500)}`);
      return null;
    }
  }

  /**
   * Mock response generator — used when IBM is not configured
   */
  _mockResponse(prompt) {
    logger.debug('Using mock response (IBM not configured)');

    // Detect what type of response is needed
    if (prompt.includes('Generate exactly 10')) {
      return JSON.stringify(this._mockInterviewQuestions());
    }
    if (prompt.includes('ATS') || prompt.includes('resume text')) {
      return JSON.stringify(this._mockResumeAnalysis());
    }
    if (prompt.includes('Evaluate the answer')) {
      return JSON.stringify(this._mockAnswerEvaluation());
    }
    if (prompt.includes('performance report')) {
      return JSON.stringify(this._mockReport());
    }
    return '{"message": "Mock response — configure IBM API key for real AI responses"}';
  }

  _mockInterviewQuestions() {
    return [
      { question: 'Can you walk me through your most challenging project and how you approached it?', category: 'Behavioral', difficulty: 'medium', expectedTopics: ['Problem identification', 'Solution approach', 'Results achieved'] },
      { question: 'How do you handle disagreements with team members about technical decisions?', category: 'Behavioral', difficulty: 'medium', expectedTopics: ['Communication', 'Compromise', 'Data-driven decisions'] },
      { question: 'Explain the difference between REST and GraphQL APIs. When would you choose one over the other?', category: 'Technical', difficulty: 'medium', expectedTopics: ['REST principles', 'GraphQL schema', 'Use cases'] },
      { question: 'How would you optimize a web application that has become slow over time?', category: 'Technical - Performance', difficulty: 'medium', expectedTopics: ['Profiling', 'Caching', 'Database optimization', 'Code splitting'] },
      { question: 'Describe your experience with version control and your preferred branching strategy.', category: 'Technical - DevOps', difficulty: 'easy', expectedTopics: ['Git workflow', 'Branch naming', 'Code review'] },
      { question: 'How do you ensure code quality in your projects?', category: 'Process', difficulty: 'medium', expectedTopics: ['Testing', 'Code review', 'Linting', 'CI/CD'] },
      { question: 'Tell me about a time you had to learn a new technology quickly. How did you approach it?', category: 'Behavioral - Learning', difficulty: 'easy', expectedTopics: ['Learning strategy', 'Resources used', 'Application'] },
      { question: 'How would you design a scalable notification system?', category: 'System Design', difficulty: 'hard', expectedTopics: ['Message queue', 'Pub/sub', 'Scalability', 'Delivery guarantees'] },
      { question: 'What is your approach to debugging a production issue under time pressure?', category: 'Problem Solving', difficulty: 'hard', expectedTopics: ['Triage', 'Logging', 'Root cause analysis', 'Communication'] },
      { question: 'Where do you see yourself in 3-5 years and how does this role fit into your career goals?', category: 'Career', difficulty: 'easy', expectedTopics: ['Growth mindset', 'Role alignment', 'Long-term vision'] },
    ];
  }

  _mockResumeAnalysis() {
    return {
      atsScore: 78,
      summary: 'A motivated developer with experience in web technologies. The resume demonstrates solid technical skills but could benefit from more quantified achievements and industry keywords.',
      skills: [
        { name: 'JavaScript', strength: 'strong', mentions: 5 },
        { name: 'React', strength: 'strong', mentions: 4 },
        { name: 'Node.js', strength: 'moderate', mentions: 2 },
        { name: 'MongoDB', strength: 'moderate', mentions: 2 },
        { name: 'CSS', strength: 'moderate', mentions: 3 },
        { name: 'Git', strength: 'weak', mentions: 1 },
      ],
      missingSkills: [
        { name: 'TypeScript', importance: 'high', reason: 'Industry standard for modern web development' },
        { name: 'Testing (Jest/Mocha)', importance: 'high', reason: 'Essential for production-ready code' },
        { name: 'Docker', importance: 'medium', reason: 'Containerization is expected in modern DevOps' },
        { name: 'AWS/Cloud', importance: 'medium', reason: 'Cloud experience is highly valued' },
      ],
      improvements: [
        { category: 'Content', title: 'Add Quantified Achievements', description: 'Replace generic descriptions with measurable impact (e.g., "Improved load time by 40%")', priority: 'high', icon: 'bi-graph-up' },
        { category: 'Format', title: 'Use Action Verbs', description: 'Start bullet points with strong action verbs like "Architected", "Optimized", "Led"', priority: 'high', icon: 'bi-pencil' },
        { category: 'Keywords', title: 'Add Industry Keywords', description: 'Include terms like "CI/CD", "Agile", "microservices" that ATS systems look for', priority: 'medium', icon: 'bi-search' },
        { category: 'Structure', title: 'Add Projects Section', description: 'Showcase 2-3 significant projects with tech stack and outcomes', priority: 'medium', icon: 'bi-folder' },
      ],
      scoreBreakdown: [
        { label: 'Formatting', score: 82 },
        { label: 'Keywords', score: 68 },
        { label: 'Experience', score: 75 },
        { label: 'Skills Match', score: 80 },
        { label: 'Education', score: 85 },
        { label: 'Impact Statements', score: 65 },
      ],
    };
  }

  _mockAnswerEvaluation() {
    return {
      score: 7,
      feedback: "Good answer that demonstrates practical understanding. You provided relevant examples and showed awareness of trade-offs. To improve, consider discussing edge cases and performance implications in more detail.",
      strengths: ['Clear communication', 'Relevant examples provided', 'Good understanding of fundamentals'],
      improvements: ['Discuss scalability considerations', 'Mention testing strategies', 'Provide more specific metrics'],
    };
  }

  _mockReport() {
    return {
      overallScore: 75,
      summary: 'The candidate demonstrated solid fundamental knowledge and good communication skills. Technical depth was adequate for the role level, with room for growth in system design and architecture discussions.',
      categoryScores: [
        { category: 'Technical Knowledge', score: 72 },
        { category: 'Communication', score: 85 },
        { category: 'Problem Solving', score: 70 },
        { category: 'System Design', score: 65 },
        { category: 'Behavioral', score: 80 },
      ],
      strengths: [
        'Strong communication skills with clear, structured responses',
        'Good practical experience with modern web technologies',
        'Demonstrates growth mindset and eagerness to learn',
      ],
      weaknesses: [
        'System design answers lacked depth on scalability',
        'Limited discussion of testing and quality assurance practices',
        'Could improve on discussing trade-offs in technical decisions',
      ],
      recommendations: [
        'Practice system design questions with a focus on scalability patterns',
        'Study common design patterns and when to apply them',
        'Prepare more quantified examples of past achievements',
        'Review testing strategies (unit, integration, e2e)',
      ],
    };
  }
}

// Singleton instance
const ibmService = new IBMService();

module.exports = ibmService;
