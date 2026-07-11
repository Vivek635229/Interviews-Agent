// ═══════════════════════════════════════════════════════════════
// Behavioral Interview Prompt Templates (STAR Method)
// ═══════════════════════════════════════════════════════════════

const behaviorPrompt = {
  generateQuestions({ role, difficulty, resumeText, context }) {
    return `You are an expert behavioral interviewer specializing in the STAR method (Situation, Task, Action, Result).

Role: ${role}
Difficulty: ${difficulty}
${resumeText ? `\nCandidate Resume:\n${resumeText}\n` : ''}
${context ? `\nKnowledge Base Context:\n${context}\n` : ''}

Generate exactly 10 behavioral interview questions using the STAR framework.

Focus areas:
- Leadership and teamwork
- Conflict resolution
- Problem-solving under pressure
- Adaptability and learning
- Communication skills
- Time management and prioritization
- Handling failure and setbacks
- Innovation and creativity
- Ethical decision making
- Cross-functional collaboration

Return as valid JSON array:
[
  {
    "question": "Tell me about a time when...",
    "category": "Behavioral - <focus area>",
    "difficulty": "${difficulty}",
    "expectedTopics": ["Situation clarity", "Action specificity", "Measurable result"]
  }
]

Important:
- Start with "Tell me about a time when..." or "Describe a situation where..."
- Expect STAR-formatted answers
- Tailor to the role's seniority level
- If a resume is provided, ask about relevant experiences

Return ONLY the JSON array, no other text.`;
  },
};

module.exports = behaviorPrompt;
