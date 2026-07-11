// ═══════════════════════════════════════════════════════════════
// Feedback Prompt Templates — Answer evaluation + Final report
// ═══════════════════════════════════════════════════════════════

const feedbackPrompt = {
  /**
   * Evaluate a single answer
   */
  evaluateAnswer({ question, answer, expectedTopics, category, difficulty, context }) {
    return `You are an expert interview evaluator assessing a candidate's answer.

Question: ${question}
Category: ${category}
Difficulty: ${difficulty}
Expected Topics: ${expectedTopics.join(', ')}
${context ? `\nRelevant Context:\n${context}\n` : ''}

Candidate's Answer:
---
${answer}
---

Evaluate the answer using this rubric:
- 9-10: Exceptional — covers all key topics with depth, provides examples, shows expert-level understanding
- 7-8: Strong — covers most topics well, demonstrates solid understanding
- 5-6: Adequate — covers basics but lacks depth or misses important topics
- 3-4: Below Average — superficial or partially incorrect
- 1-2: Poor — largely incorrect or irrelevant

Return your evaluation as valid JSON:
{
  "score": <number 1-10>,
  "feedback": "<2-3 sentences of specific feedback about their answer>",
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>"]
}

Be encouraging but honest. Reference specific parts of their answer.
Return ONLY the JSON, no other text.`;
  },

  /**
   * Generate final interview report
   */
  generateReport({ role, company, type, difficulty, questionsAndAnswers }) {
    const qaText = questionsAndAnswers
      .map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer}\nScore: ${qa.score}/10`)
      .join('\n\n');

    return `You are a senior hiring manager preparing a comprehensive interview performance report.

Interview Details:
- Role: ${role}
- Company: ${company || 'General'}
- Type: ${type}
- Difficulty: ${difficulty}

Questions and Answers:
${qaText}

Generate a comprehensive performance report as valid JSON:
{
  "overallScore": <number 0-100>,
  "summary": "<3-4 sentence executive summary of the candidate's performance>",
  "categoryScores": [
    { "category": "<category name>", "score": <0-100> }
  ],
  "strengths": [
    "<specific strength with evidence from answers>"
  ],
  "weaknesses": [
    "<specific weakness with evidence from answers>"
  ],
  "recommendations": [
    "<actionable recommendation for improvement>"
  ]
}

Guidelines:
- Overall score should reflect the weighted average of individual scores
- Category scores should be derived from questions in each category
- Provide 3-5 strengths, weaknesses, and recommendations each
- Be specific — reference actual answers, not generic advice
- Recommendations should be actionable and prioritized

Return ONLY the JSON, no other text.`;
  },
};

module.exports = feedbackPrompt;
