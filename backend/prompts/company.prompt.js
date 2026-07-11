// ═══════════════════════════════════════════════════════════════
// Company-Specific Interview Prompt Templates
// ═══════════════════════════════════════════════════════════════

const companyPrompt = {
  generateQuestions({ role, difficulty, company, resumeText, context }) {
    return `You are a hiring manager at ${company || 'a leading tech company'} interviewing for the role of "${role}".

Difficulty: ${difficulty}
Company: ${company || 'General'}
${resumeText ? `\nCandidate Resume:\n${resumeText}\n` : ''}
${context ? `\nCompany Knowledge:\n${context}\n` : ''}

Generate exactly 10 interview questions that reflect ${company || 'the company'}'s:
- Culture and values
- Technical stack and practices
- Business domain and challenges
- Team structure and collaboration style
- Growth and innovation priorities

Structure:
Questions 1-2: Culture fit and motivation
Questions 3-4: Role-specific experience
Questions 5-7: Technical/domain expertise
Questions 8-9: Problem-solving and case studies
Question 10: Candidate's questions/curiosity

Return as valid JSON array:
[
  {
    "question": "...",
    "category": "Company - <focus area>",
    "difficulty": "${difficulty}",
    "expectedTopics": ["...", "...", "..."]
  }
]

Guidelines:
- Research-style questions that test company knowledge
- Include questions about why they want to work at ${company || 'the company'}
- Ask about alignment with company values
- Include at least one scenario-based question

Return ONLY the JSON array, no other text.`;
  },
};

module.exports = companyPrompt;
