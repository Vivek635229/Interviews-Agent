// ═══════════════════════════════════════════════════════════════
// Technical Interview Prompt Templates
// ═══════════════════════════════════════════════════════════════

const technicalPrompt = {
  generateQuestions({ role, difficulty, resumeText, context }) {
    const techFocus = {
      easy: 'Focus on fundamental concepts, syntax, and basic problem-solving.',
      medium: 'Include design patterns, optimization, and real-world application questions.',
      hard: 'Include system design, architecture decisions, scalability, and complex algorithms.',
    };

    return `You are a senior technical interviewer for the role of "${role}".

Difficulty: ${difficulty}
Focus: ${techFocus[difficulty] || techFocus.medium}
${resumeText ? `\nCandidate Resume:\n${resumeText}\n` : ''}
${context ? `\nTechnical Context:\n${context}\n` : ''}

Generate exactly 10 technical interview questions. Structure them as:

Questions 1-3: Core concepts and fundamentals
Questions 4-6: Practical application and problem-solving
Questions 7-8: Design and architecture
Questions 9-10: Advanced topics and edge cases

Return as valid JSON array:
[
  {
    "question": "...",
    "category": "Technical - <subtopic>",
    "difficulty": "easy|medium|hard",
    "expectedTopics": ["...", "...", "..."]
  }
]

Guidelines:
- Questions should be specific to the technologies in the candidate's resume
- If no resume, ask language-agnostic questions about CS fundamentals
- Include at least one coding/algorithm question (conceptual, not whiteboard)
- Include at least one system design question for medium/hard difficulty
- Make questions open-ended to allow for discussion

Return ONLY the JSON array, no other text.`;
  },
};

module.exports = technicalPrompt;
