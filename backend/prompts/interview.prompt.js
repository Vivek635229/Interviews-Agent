// ═══════════════════════════════════════════════════════════════
// Interview Prompt Templates
// ═══════════════════════════════════════════════════════════════

const interviewPrompt = {
  /**
   * Generate interview questions
   */
  generateQuestions({ type, role, difficulty, company, resumeText, context }) {
    const difficultyGuide = {
      easy: 'Ask fundamental, concept-checking questions suitable for junior candidates.',
      medium: 'Ask moderately challenging questions that test practical application and problem-solving.',
      hard: 'Ask advanced, system-design level questions that test deep expertise and architectural thinking.',
    };

    return `You are an expert interview trainer for the role of "${role}"${company ? ` at ${company}` : ''}.

Interview Type: ${type}
Difficulty Level: ${difficulty}
Guidance: ${difficultyGuide[difficulty] || difficultyGuide.medium}

${resumeText ? `Candidate's Resume:\n${resumeText}\n` : ''}
${context ? `Additional Context from Knowledge Base:\n${context}\n` : ''}

Generate exactly 10 interview questions for this candidate. For each question, provide:
1. The question text
2. The category (e.g., "Technical", "Behavioral", "Problem Solving", "System Design", "Communication")
3. The difficulty level (easy, medium, hard)
4. Expected topics the candidate should cover (3-5 key points)

Return your response as a valid JSON array with this exact structure:
[
  {
    "question": "...",
    "category": "...",
    "difficulty": "...",
    "expectedTopics": ["...", "...", "..."]
  }
]

Important:
- Questions should progressively increase in difficulty
- Mix different categories for a well-rounded interview
- If a resume is provided, tailor at least 40% of questions to the candidate's experience
- Questions should be open-ended, not yes/no
- Return ONLY the JSON array, no other text`;
  },

  /**
   * Generate a single follow-up question
   */
  followUp({ previousQuestion, previousAnswer, role, difficulty }) {
    return `You are an expert interviewer for the role of "${role}".

The candidate just answered this question:
Question: ${previousQuestion}
Answer: ${previousAnswer}

Generate a thoughtful follow-up question that:
1. Digs deeper into the candidate's answer
2. Tests their understanding at a "${difficulty}" difficulty level
3. Is related to the original topic but explores a different angle

Return your response as valid JSON:
{
  "question": "...",
  "category": "...",
  "difficulty": "${difficulty}",
  "expectedTopics": ["...", "...", "..."]
}

Return ONLY the JSON, no other text.`;
  },
};

module.exports = interviewPrompt;
