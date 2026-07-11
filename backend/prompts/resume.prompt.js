// ═══════════════════════════════════════════════════════════════
// Resume Analysis Prompt Templates
// ═══════════════════════════════════════════════════════════════

const resumePrompt = {
  /**
   * Full resume analysis — ATS score, skills, improvements
   */
  analyzeResume(extractedText) {
    return `You are an expert ATS (Applicant Tracking System) analyst and career coach.

Analyze the following resume text and provide a comprehensive evaluation.

Resume Text:
---
${extractedText}
---

Provide your analysis as a valid JSON object with this exact structure:
{
  "atsScore": <number 0-100>,
  "summary": "<2-3 sentence professional summary of the candidate>",
  "skills": [
    { "name": "<skill>", "strength": "strong|moderate|weak", "mentions": <count> }
  ],
  "missingSkills": [
    { "name": "<skill>", "importance": "high|medium|low", "reason": "<why this skill matters>" }
  ],
  "improvements": [
    {
      "category": "<section>",
      "title": "<short title>",
      "description": "<actionable suggestion>",
      "priority": "high|medium|low",
      "icon": "<bootstrap-icon-class>"
    }
  ],
  "scoreBreakdown": [
    { "label": "Formatting", "score": <0-100> },
    { "label": "Keywords", "score": <0-100> },
    { "label": "Experience", "score": <0-100> },
    { "label": "Skills Match", "score": <0-100> },
    { "label": "Education", "score": <0-100> },
    { "label": "Impact Statements", "score": <0-100> }
  ]
}

Scoring Guidelines:
- ATS Score: Overall compatibility with modern ATS systems (keyword density, formatting, structure)
- Formatting: Clean structure, consistent headings, no tables/images
- Keywords: Relevant industry terms and technologies
- Experience: Quantified achievements, action verbs, relevant roles
- Skills Match: Technical and soft skills coverage
- Education: Relevant degrees, certifications
- Impact Statements: Measurable results (numbers, percentages, scale)

For icons, use Bootstrap Icons classes like: bi-file-text, bi-lightbulb, bi-graph-up, bi-trophy, bi-pencil, bi-bullseye, bi-people, bi-star

Return ONLY the JSON object, no other text.`;
  },
};

module.exports = resumePrompt;
