// ═══════════════════════════════════════════════════════════════
// Realistic Placeholder Data — Future-ready for backend integration
// ═══════════════════════════════════════════════════════════════

export const USER_PROFILE = {
  id: 'usr_01',
  name: 'Vivek Sharma',
  email: 'vivek.sharma@ibm.com',
  avatar: null,
  role: 'Software Engineer',
  joinedAt: '2026-05-15',
  preferences: {
    theme: 'light',
    notifications: true,
    language: 'en',
  },
};

export const DASHBOARD_STATS = [
  { id: 1, label: 'Interviews Completed', value: 24, icon: 'bi-chat-dots', trend: '+12%', trendUp: true },
  { id: 2, label: 'Resume Score', value: 87, icon: 'bi-file-earmark-check', suffix: '%', trend: '+5%', trendUp: true },
  { id: 3, label: 'Avg. Performance', value: 78, icon: 'bi-graph-up-arrow', suffix: '%', trend: '+8%', trendUp: true },
  { id: 4, label: 'Skills Mastered', value: 12, icon: 'bi-trophy', trend: '+3', trendUp: true },
];

export const RECENT_INTERVIEWS = [
  { id: 'int_01', role: 'Senior Frontend Developer', company: 'IBM', date: '2026-07-10', score: 92, status: 'completed', duration: '34 min', questions: 12 },
  { id: 'int_02', role: 'Full Stack Engineer', company: 'Google', date: '2026-07-08', score: 85, status: 'completed', duration: '28 min', questions: 10 },
  { id: 'int_03', role: 'React Developer', company: 'Microsoft', date: '2026-07-05', score: 78, status: 'completed', duration: '31 min', questions: 11 },
  { id: 'int_04', role: 'Software Engineer', company: 'Meta', date: '2026-07-03', score: 88, status: 'completed', duration: '26 min', questions: 9 },
  { id: 'int_05', role: 'Backend Developer', company: 'Amazon', date: '2026-06-28', score: 72, status: 'completed', duration: '35 min', questions: 13 },
];

export const SKILL_PROGRESS = [
  { name: 'React.js', level: 92, category: 'Frontend' },
  { name: 'JavaScript', level: 88, category: 'Languages' },
  { name: 'TypeScript', level: 75, category: 'Languages' },
  { name: 'Node.js', level: 80, category: 'Backend' },
  { name: 'Python', level: 70, category: 'Languages' },
  { name: 'System Design', level: 65, category: 'Architecture' },
  { name: 'Data Structures', level: 82, category: 'CS Fundamentals' },
  { name: 'SQL', level: 78, category: 'Database' },
  { name: 'MongoDB', level: 72, category: 'Database' },
  { name: 'AWS/Cloud', level: 60, category: 'Infrastructure' },
];

export const ACHIEVEMENTS = [
  { id: 1, title: 'First Interview', description: 'Completed your first AI interview', icon: 'bi-rocket-takeoff', earned: true, date: '2026-05-20' },
  { id: 2, title: 'Perfect Score', description: 'Scored 95%+ in an interview', icon: 'bi-star', earned: true, date: '2026-06-15' },
  { id: 3, title: 'Streak Master', description: 'Completed 5 interviews in a week', icon: 'bi-lightning-charge', earned: true, date: '2026-06-22' },
  { id: 4, title: 'Skill Explorer', description: 'Practiced 10 different skill areas', icon: 'bi-compass', earned: true, date: '2026-07-01' },
  { id: 5, title: 'Consistency', description: 'Practiced for 30 consecutive days', icon: 'bi-calendar-check', earned: false, date: null },
  { id: 6, title: 'Expert Level', description: 'Reached expert in any skill', icon: 'bi-award', earned: false, date: null },
];

export const RECENT_ACTIVITY = [
  { id: 1, type: 'interview', message: 'Completed Senior Frontend Developer interview', time: '2 hours ago', icon: 'bi-chat-dots' },
  { id: 2, type: 'resume', message: 'Updated resume — ATS score improved to 87%', time: '5 hours ago', icon: 'bi-file-earmark-arrow-up' },
  { id: 3, type: 'achievement', message: 'Earned "Skill Explorer" achievement', time: '1 day ago', icon: 'bi-trophy' },
  { id: 4, type: 'interview', message: 'Completed Full Stack Engineer interview', time: '3 days ago', icon: 'bi-chat-dots' },
  { id: 5, type: 'skill', message: 'React.js skill level increased to 92%', time: '3 days ago', icon: 'bi-graph-up' },
];

export const QUICK_ACTIONS = [
  { id: 1, label: 'Start Interview', description: 'Begin a new AI-powered mock interview', icon: 'bi-play-circle', path: '/interview', color: 'primary' },
  { id: 2, label: 'Upload Resume', description: 'Upload and analyze your resume', icon: 'bi-cloud-arrow-up', path: '/resume/upload', color: 'default' },
  { id: 3, label: 'View Reports', description: 'Check your performance analytics', icon: 'bi-bar-chart-line', path: '/reports', color: 'default' },
  { id: 4, label: 'Practice Skills', description: 'Focus on specific skill areas', icon: 'bi-bullseye', path: '/interview', color: 'default' },
];

// ── Interview Chat Data ──
export const INTERVIEW_MESSAGES = [
  {
    id: 1,
    role: 'ai',
    content: "Hello! I'm your AI Interview Trainer powered by IBM Granite. Today we'll be conducting a technical interview for a Senior Frontend Developer position. I'll ask you a series of questions to evaluate your skills. Ready to begin?",
    timestamp: '10:00 AM',
  },
  {
    id: 2,
    role: 'user',
    content: "Yes, I'm ready! Let's get started.",
    timestamp: '10:01 AM',
  },
  {
    id: 3,
    role: 'ai',
    content: "Great! Let's start with a fundamental question. Can you explain the difference between React's `useMemo` and `useCallback` hooks? When would you use each one, and what performance implications do they have?",
    timestamp: '10:01 AM',
  },
  {
    id: 4,
    role: 'user',
    content: "Sure! `useMemo` memoizes a computed value and only recalculates it when its dependencies change. It's useful for expensive computations like filtering or sorting large datasets. `useCallback` memoizes a function reference, preventing unnecessary re-renders of child components that receive the function as a prop. Both help optimize performance by reducing unnecessary recalculations and re-renders, but they should be used judiciously as they add their own overhead.",
    timestamp: '10:03 AM',
  },
  {
    id: 5,
    role: 'ai',
    content: "Excellent answer! You've clearly articulated the distinction and practical use cases. I especially appreciate your point about using them judiciously. Score: 9/10.\n\nLet's move to the next question. How would you architect a real-time collaborative editing feature in a React application? Consider the data synchronization, conflict resolution, and component architecture.",
    timestamp: '10:03 AM',
  },
];

export const INTERVIEW_QUESTIONS = [
  { id: 1, question: 'Explain useMemo vs useCallback', category: 'React', difficulty: 'Medium', status: 'answered', score: 9 },
  { id: 2, question: 'Real-time collaborative editing architecture', category: 'System Design', difficulty: 'Hard', status: 'current', score: null },
  { id: 3, question: 'CSS-in-JS vs CSS Modules trade-offs', category: 'Frontend', difficulty: 'Medium', status: 'upcoming', score: null },
  { id: 4, question: 'Optimize React application performance', category: 'Performance', difficulty: 'Hard', status: 'upcoming', score: null },
  { id: 5, question: 'Implement infinite scroll with virtualization', category: 'React', difficulty: 'Medium', status: 'upcoming', score: null },
  { id: 6, question: 'Micro-frontend architecture', category: 'Architecture', difficulty: 'Hard', status: 'upcoming', score: null },
  { id: 7, question: 'State management patterns comparison', category: 'React', difficulty: 'Medium', status: 'upcoming', score: null },
  { id: 8, question: 'Web accessibility best practices', category: 'Frontend', difficulty: 'Medium', status: 'upcoming', score: null },
  { id: 9, question: 'Testing strategies for React apps', category: 'Testing', difficulty: 'Medium', status: 'upcoming', score: null },
  { id: 10, question: 'Design a component library', category: 'Architecture', difficulty: 'Hard', status: 'upcoming', score: null },
];

// ── Resume Data ──
export const RESUME_DATA = {
  name: 'Vivek Sharma',
  email: 'vivek.sharma@ibm.com',
  phone: '+91 98765 43210',
  location: 'Bangalore, India',
  summary: 'Full-stack developer with 3+ years of experience building scalable web applications. Passionate about AI/ML integration and cloud-native architectures.',
  atsScore: 87,
  uploadDate: '2026-07-08',
  fileName: 'Vivek_Sharma_Resume_2026.pdf',
  fileSize: '245 KB',
};

export const RESUME_SKILLS = {
  found: [
    { name: 'React.js', strength: 'strong', mentions: 8 },
    { name: 'JavaScript', strength: 'strong', mentions: 12 },
    { name: 'Node.js', strength: 'moderate', mentions: 5 },
    { name: 'Python', strength: 'moderate', mentions: 4 },
    { name: 'TypeScript', strength: 'moderate', mentions: 3 },
    { name: 'MongoDB', strength: 'moderate', mentions: 3 },
    { name: 'Git', strength: 'strong', mentions: 6 },
    { name: 'REST APIs', strength: 'strong', mentions: 7 },
    { name: 'HTML/CSS', strength: 'strong', mentions: 9 },
    { name: 'SQL', strength: 'moderate', mentions: 4 },
  ],
  missing: [
    { name: 'Docker', importance: 'high', reason: 'Required in 78% of similar job postings' },
    { name: 'Kubernetes', importance: 'medium', reason: 'Growing demand in enterprise roles' },
    { name: 'GraphQL', importance: 'medium', reason: 'Increasingly preferred over REST' },
    { name: 'CI/CD', importance: 'high', reason: 'Essential for DevOps-aligned roles' },
    { name: 'AWS/GCP', importance: 'high', reason: 'Cloud skills are in top demand' },
    { name: 'Testing (Jest/Cypress)', importance: 'medium', reason: 'Shows quality-first mindset' },
  ],
};

export const RESUME_IMPROVEMENTS = [
  { id: 1, category: 'Impact', title: 'Quantify your achievements', description: 'Add specific metrics like "Reduced load time by 40%" or "Served 100K+ users".', priority: 'high', icon: 'bi-graph-up' },
  { id: 2, category: 'Skills', title: 'Add cloud platform experience', description: 'Include AWS, GCP, or Azure certifications and project experience.', priority: 'high', icon: 'bi-cloud' },
  { id: 3, category: 'Format', title: 'Optimize for ATS parsers', description: 'Use standard section headers and avoid tables or complex formatting.', priority: 'medium', icon: 'bi-file-earmark-text' },
  { id: 4, category: 'Keywords', title: 'Include industry keywords', description: 'Add terms like "agile", "CI/CD", "microservices" that recruiters search for.', priority: 'medium', icon: 'bi-search' },
  { id: 5, category: 'Experience', title: 'Expand project descriptions', description: 'Describe your role, technologies used, and outcomes for each project.', priority: 'low', icon: 'bi-briefcase' },
];

export const RESUME_SCORE_BREAKDOWN = [
  { label: 'Contact Information', score: 95 },
  { label: 'Work Experience', score: 82 },
  { label: 'Skills Match', score: 88 },
  { label: 'Education', score: 90 },
  { label: 'Keywords', score: 78 },
  { label: 'Formatting', score: 92 },
  { label: 'Length & Readability', score: 85 },
];

// ── Landing Page Data ──
export const FEATURES = [
  { id: 1, title: 'AI-Powered Interviews', description: 'Practice with our advanced AI that simulates real interview scenarios using IBM Granite models.', icon: 'bi-cpu' },
  { id: 2, title: 'Smart Resume Analysis', description: 'Get instant ATS scoring and actionable improvement suggestions for your resume.', icon: 'bi-file-earmark-bar-graph' },
  { id: 3, title: 'Personalized Feedback', description: 'Receive detailed performance reports with skill-by-skill breakdowns after every interview.', icon: 'bi-chat-square-text' },
  { id: 4, title: 'Progress Tracking', description: 'Monitor your improvement over time with comprehensive analytics and skill progression charts.', icon: 'bi-graph-up-arrow' },
  { id: 5, title: 'Industry Focused', description: 'Tailored interview questions for specific roles — from frontend to full-stack to system design.', icon: 'bi-briefcase' },
  { id: 6, title: 'Available 24/7', description: 'Practice anytime, anywhere. No scheduling needed. Your AI interviewer is always ready.', icon: 'bi-clock' },
];

export const HOW_IT_WORKS_STEPS = [
  { step: 1, title: 'Upload Your Resume', description: 'Start by uploading your resume. Our AI analyzes it to understand your background and tailor interview questions.', icon: 'bi-cloud-arrow-up' },
  { step: 2, title: 'Choose Your Interview', description: 'Select the role and difficulty level. Our AI prepares questions specific to your target position.', icon: 'bi-sliders' },
  { step: 3, title: 'Practice with AI', description: 'Engage in a realistic interview conversation. Answer questions, get follow-ups, and experience real pressure.', icon: 'bi-chat-dots' },
  { step: 4, title: 'Get Detailed Feedback', description: 'Receive comprehensive scoring, improvement suggestions, and track your progress over time.', icon: 'bi-clipboard-data' },
];

export const TESTIMONIALS = [
  { id: 1, name: 'Priya Patel', role: 'Software Engineer at Google', content: 'This tool completely transformed my interview preparation. The AI feedback was incredibly detailed and helped me improve my system design answers.', avatar: null },
  { id: 2, name: 'Arjun Mehta', role: 'Frontend Developer at Microsoft', content: "The resume analysis feature alone is worth it. It helped me optimize my resume and I started getting 3x more callbacks from recruiters.", avatar: null },
  { id: 3, name: 'Sarah Chen', role: 'Full Stack Developer at Meta', content: "It's like having a senior engineer coach you 24/7. The questions are realistic and the feedback is actionable. Highly recommend for anyone preparing for tech interviews.", avatar: null },
];

export const FAQ_ITEMS = [
  { id: 1, question: 'How does the AI interview work?', answer: 'Our AI uses IBM Granite large language models to simulate realistic technical interviews. It adapts questions based on your resume, experience level, and target role, providing real-time feedback and scoring.' },
  { id: 2, question: 'What types of interviews are supported?', answer: 'We support technical interviews for various roles including Frontend, Backend, Full Stack, System Design, Data Structures & Algorithms, and Behavioral rounds.' },
  { id: 3, question: 'How accurate is the resume ATS scoring?', answer: 'Our ATS scoring algorithm analyzes your resume against industry-standard criteria used by major ATS systems. It evaluates formatting, keyword density, section structure, and content relevance.' },
  { id: 4, question: 'Is my data secure?', answer: 'Absolutely. Your data stays yours. All resume uploads and interview conversations are encrypted and stored securely. We never share your data with third parties.' },
  { id: 5, question: 'Can I track my progress over time?', answer: 'Yes! Our comprehensive dashboard shows your interview scores, skill progression, and improvement areas over time with detailed analytics and charts.' },
  { id: 6, question: 'Is it free to use?', answer: 'We offer a free tier with limited interviews per month. Premium plans unlock unlimited interviews, advanced analytics, and priority access to new features.' },
];

// ── Interview History ──
export const INTERVIEW_HISTORY = [
  { id: 'int_01', role: 'Senior Frontend Developer', company: 'IBM', date: '2026-07-10', score: 92, duration: '34 min', questions: 12, category: 'Technical', difficulty: 'Hard' },
  { id: 'int_02', role: 'Full Stack Engineer', company: 'Google', date: '2026-07-08', score: 85, duration: '28 min', questions: 10, category: 'Technical', difficulty: 'Medium' },
  { id: 'int_03', role: 'React Developer', company: 'Microsoft', date: '2026-07-05', score: 78, duration: '31 min', questions: 11, category: 'Technical', difficulty: 'Medium' },
  { id: 'int_04', role: 'Software Engineer', company: 'Meta', date: '2026-07-03', score: 88, duration: '26 min', questions: 9, category: 'System Design', difficulty: 'Hard' },
  { id: 'int_05', role: 'Backend Developer', company: 'Amazon', date: '2026-06-28', score: 72, duration: '35 min', questions: 13, category: 'Technical', difficulty: 'Hard' },
  { id: 'int_06', role: 'DevOps Engineer', company: 'Netflix', date: '2026-06-25', score: 68, duration: '30 min', questions: 10, category: 'Infrastructure', difficulty: 'Medium' },
  { id: 'int_07', role: 'ML Engineer', company: 'OpenAI', date: '2026-06-20', score: 75, duration: '32 min', questions: 11, category: 'AI/ML', difficulty: 'Hard' },
  { id: 'int_08', role: 'Product Engineer', company: 'Stripe', date: '2026-06-18', score: 90, duration: '25 min', questions: 8, category: 'Behavioral', difficulty: 'Medium' },
];

// ── Reports / Performance Data ──
export const PERFORMANCE_OVER_TIME = [
  { month: 'Feb', score: 62 },
  { month: 'Mar', score: 68 },
  { month: 'Apr', score: 72 },
  { month: 'May', score: 75 },
  { month: 'Jun', score: 80 },
  { month: 'Jul', score: 87 },
];

export const CATEGORY_SCORES = [
  { category: 'Technical Skills', score: 85 },
  { category: 'Problem Solving', score: 78 },
  { category: 'Communication', score: 90 },
  { category: 'System Design', score: 72 },
  { category: 'Behavioral', score: 88 },
  { category: 'Code Quality', score: 82 },
];
