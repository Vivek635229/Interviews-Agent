import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import ProgressBar from '../../components/data-display/ProgressBar';
import { useTimer } from '../../hooks/useTimer';
import interviewSvc from '../../services/interviewService';
import resumeService from '../../services/resumeService';

/* ── Chat Bubble ── */
const ChatBubble = ({ role, content, timestamp }) => {
  const isAI = role === 'ai';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAI ? 'bg-primary text-on-primary' : 'bg-surface-soft text-ink'}`}>
        <i className={isAI ? 'bi-cpu' : 'bi-person'} style={{ fontSize: '14px' }} />
      </div>
      <div className={`max-w-[70%] ${isAI ? '' : 'text-right'}`}>
        <div className={`inline-block rounded-lg px-4 py-3 text-body-sm ${isAI ? 'bg-surface-soft text-ink rounded-tl-none' : 'bg-primary text-on-primary rounded-tr-none'}`}>
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
        <p className="text-caption-sm text-mute mt-1">{timestamp}</p>
      </div>
    </motion.div>
  );
};

/* ── Typing Indicator ── */
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex gap-3"
  >
    <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
      <i className="bi-cpu" style={{ fontSize: '14px' }} />
    </div>
    <div className="bg-surface-soft rounded-lg rounded-tl-none px-4 py-3 flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-mute"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  </motion.div>
);

/* ── Interview Setup Form ── */
const InterviewSetup = ({ onStart, loading }) => {
  const [type, setType] = useState('technical');
  const [difficulty, setDifficulty] = useState('medium');
  const [role, setRole] = useState('Software Developer');
  const [company, setCompany] = useState('');
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await resumeService.getUserResumes();
        setResumes(data?.resumes || []);
        if (data?.resumes?.length > 0) {
          setSelectedResume(data.resumes[0]._id);
        }
      } catch {
        // No resumes available
      }
    };
    fetchResumes();
  }, []);

  const handleStart = () => {
    onStart({ type, difficulty, role, company, resumeId: selectedResume || undefined });
  };

  const types = [
    { value: 'technical', label: 'Technical', icon: 'bi-code-slash' },
    { value: 'behavioral', label: 'Behavioral', icon: 'bi-people' },
    { value: 'hr', label: 'HR', icon: 'bi-person-badge' },
    { value: 'resume', label: 'Resume-Based', icon: 'bi-file-earmark-text' },
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  return (
    <div className="flex items-center justify-center h-full p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px]"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary text-on-primary flex items-center justify-center">
            <i className="bi-cpu text-2xl" />
          </div>
          <h2 className="font-display text-display-lg text-ink mb-2">Start Interview</h2>
          <p className="text-body-md text-body">Configure your AI-powered mock interview</p>
        </div>

        <Card className="p-6 space-y-5">
          {/* Interview Type */}
          <div>
            <label className="text-body-sm-strong text-ink mb-2 block">Interview Type</label>
            <div className="grid grid-cols-2 gap-2">
              {types.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-body-sm transition-colors ${type === t.value ? 'border-primary bg-primary/5 text-ink' : 'border-hairline text-body hover:bg-surface-soft'}`}
                >
                  <i className={t.icon} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-body-sm-strong text-ink mb-2 block">Difficulty</label>
            <div className="flex gap-2">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-body-sm text-center transition-colors ${difficulty === d.value ? 'border-primary bg-primary/5 text-ink' : 'border-hairline text-body hover:bg-surface-soft'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Role */}
          <Input
            label="Target Role"
            placeholder="e.g., Senior Frontend Developer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          {/* Company */}
          <Input
            label="Company (optional)"
            placeholder="e.g., Google, IBM, Microsoft"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          {/* Resume Selection */}
          {resumes.length > 0 && (
            <div>
              <label className="text-body-sm-strong text-ink mb-2 block">Use Resume</label>
              <select
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                className="w-full bg-surface-soft border-none rounded-lg px-4 py-3 text-body-sm text-ink outline-none"
              >
                <option value="">None</option>
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>{r.originalName}</option>
                ))}
              </select>
            </div>
          )}

          <Button fullWidth size="lg" onClick={handleStart} disabled={loading}>
            {loading ? 'Starting...' : 'Start Interview'}
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

/**
 * InterviewContent — full interview chat page with AI backend integration.
 */
const InterviewContent = () => {
  const [started, setStarted] = useState(false);
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [report, setReport] = useState(null);
  const chatEndRef = useRef(null);
  const timer = useTimer();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleStart = async (config) => {
    setStartLoading(true);
    try {
      const response = await interviewSvc.startInterview(config);
      const data = response.data;
      setSession(data.session);
      setCurrentQuestion(data.question);
      setQuestions([{
        ...data.question,
        status: 'current',
        score: null,
      }]);
      setStarted(true);
      timer.start();

      // Add AI greeting + first question
      setMessages([
        {
          id: 1, role: 'ai',
          content: `Hello! I'm your AI Interview Trainer powered by IBM Granite. Today we'll be conducting a ${config.difficulty} ${config.type} interview for a ${config.role} position${config.company ? ` at ${config.company}` : ''}. I'll ask you ${data.session.totalQuestions} questions to evaluate your skills.\n\nLet's begin!\n\n**Question 1:** ${data.question.question}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      // console.error removed for production
      alert(err.response?.data?.message || 'Failed to start interview.');
    } finally {
      setStartLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping || isComplete) return;

    const userMsg = {
      id: messages.length + 1,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    const answer = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      // Evaluate the answer
      const evalResponse = await interviewSvc.evaluateAnswer({
        sessionId: session.id,
        questionId: currentQuestion.id,
        answer,
      });
      const evaluation = evalResponse.data.answer;

      // Update question status
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === currentQuestion.id
            ? { ...q, status: 'answered', score: evaluation.score }
            : q
        )
      );

      // Build AI feedback message
      let aiContent = `**Score: ${evaluation.score}/10**\n\n${evaluation.feedback}`;

      if (evaluation.strengths?.length > 0) {
        aiContent += `\n\n✅ **Strengths:** ${evaluation.strengths.join(', ')}`;
      }
      if (evaluation.improvements?.length > 0) {
        aiContent += `\n\n📈 **Areas to improve:** ${evaluation.improvements.join(', ')}`;
      }

      // Get next question
      const nextResponse = await interviewSvc.getNextQuestion(session.id);

      if (nextResponse.data.isComplete) {
        // All questions answered
        aiContent += '\n\n---\n\nAll questions answered! Let me generate your performance report...';
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1, role: 'ai', content: aiContent,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        // Complete the interview
        timer.stop();
        const completeResponse = await interviewSvc.completeInterview(session.id);
        setReport(completeResponse.data.report);
        setIsComplete(true);

        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1, role: 'ai',
            content: `🎉 **Interview Complete!**\n\n**Overall Score: ${completeResponse.data.report.overallScore}%**\n\n${completeResponse.data.report.summary}\n\n**Strengths:** ${(completeResponse.data.report.strengths || []).join(', ')}\n\n**Areas to improve:** ${(completeResponse.data.report.weaknesses || []).join(', ')}\n\n**Recommendations:**\n${(completeResponse.data.report.recommendations || []).map((r) => `• ${r}`).join('\n')}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }

      // Next question available
      const nextQ = nextResponse.data.question;
      aiContent += `\n\n---\n\n**Question ${nextQ.questionNumber}:** ${nextQ.question}`;

      setCurrentQuestion(nextQ);
      setQuestions((prev) => [
        ...prev,
        { ...nextQ, status: 'current', score: null },
      ]);

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1, role: 'ai', content: aiContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      // console.error removed for production
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1, role: 'ai',
          content: 'Sorry, I encountered an error evaluating your answer. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  // Show setup form if not started
  if (!started) {
    return <InterviewSetup onStart={handleStart} loading={startLoading} />;
  }

  const answeredCount = questions.filter((q) => q.status === 'answered').length;
  const answeredQuestions = questions.filter((q) => q.score != null);
  const avgScore = answeredQuestions.length > 0
    ? answeredQuestions.reduce((a, b) => a + b.score, 0) / answeredQuestions.length
    : 0;

  return (
    <div className="flex h-full">
      {/* Left — Chat */}
      <div className="flex-1 flex flex-col h-full border-r border-hairline">
        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-hairline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center">
              <i className="bi-cpu" style={{ fontSize: '14px' }} />
            </div>
            <div>
              <p className="text-body-sm-strong text-ink">AI Interview Trainer</p>
              <p className="text-caption-sm text-mute">{session?.role || 'Interview'} · {session?.company || 'General'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isComplete ? 'default' : 'success'} icon={isComplete ? '' : 'bi-circle-fill'} size="sm">
              {isComplete ? 'Completed' : 'Live'}
            </Badge>
            <span className="font-mono text-body-sm text-ink">{timer.formatted}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} {...msg} />
          ))}
          <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-hairline">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={isComplete ? 'Interview completed' : 'Type your answer...'}
                rows={1}
                disabled={isComplete || isTyping}
                className="w-full bg-surface-soft border-none rounded-lg px-4 py-3 text-body-sm text-ink placeholder:text-mute resize-none focus:ring-2 focus:ring-focus-ring outline-none disabled:opacity-50"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
            <Button onClick={handleSend} icon="bi-send" disabled={!input.trim() || isComplete || isTyping}>
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Right — Info Panel */}
      <div className="hidden lg:flex flex-col w-[340px] h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Current Question */}
          {currentQuestion && !isComplete && (
            <Card variant="soft">
              <div className="flex items-center justify-between mb-3">
                <Badge size="sm">Question {currentQuestion.questionNumber}/{session?.totalQuestions || '?'}</Badge>
                <Badge variant={currentQuestion.difficulty === 'hard' ? 'danger' : 'warning'} size="sm">{currentQuestion.difficulty}</Badge>
              </div>
              <p className="text-body-sm-strong text-ink mb-2">{currentQuestion.question}</p>
              <p className="text-caption-sm text-mute">{currentQuestion.category}</p>
            </Card>
          )}

          {/* Progress */}
          <Card>
            <h3 className="text-body-sm-strong text-ink mb-3">Interview Progress</h3>
            <ProgressBar value={answeredCount} max={session?.totalQuestions || 10} showValue={false} height={6} />
            <p className="text-caption-sm text-mute mt-2">{answeredCount} of {session?.totalQuestions || '?'} questions answered</p>
          </Card>

          {/* Score */}
          <Card>
            <h3 className="text-body-sm-strong text-ink mb-3">Current Score</h3>
            <p className="font-display text-display-lg text-ink">{avgScore.toFixed(1)}<span className="text-body-md text-mute">/10</span></p>
          </Card>

          {/* Timer */}
          <Card>
            <h3 className="text-body-sm-strong text-ink mb-3">Session Timer</h3>
            <p className="font-mono text-heading-lg text-ink">{timer.formatted}</p>
          </Card>

          {/* Report Summary (when complete) */}
          {isComplete && report && (
            <Card variant="soft">
              <h3 className="text-body-sm-strong text-ink mb-3">Final Report</h3>
              <p className="font-display text-display-lg text-ink mb-2">{report.overallScore}%</p>
              <p className="text-body-sm text-body">{report.summary?.substring(0, 150)}...</p>
            </Card>
          )}

          {/* Questions List */}
          <Card>
            <h3 className="text-body-sm-strong text-ink mb-3">Questions</h3>
            <div className="space-y-2">
              {questions.slice(0, 10).map((q) => (
                <div key={q.id} className="flex items-center gap-2 text-caption-sm">
                  <i className={`${q.status === 'answered' ? 'bi-check-circle-fill text-terminal-green' : q.status === 'current' ? 'bi-arrow-right-circle-fill text-ink' : 'bi-circle text-mute'}`} />
                  <span className={q.status === 'current' ? 'text-ink font-medium' : 'text-body'}>{q.question?.substring(0, 50)}...</span>
                  {q.score != null && <span className="ml-auto text-mute">{q.score}/10</span>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewContent;
