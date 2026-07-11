import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate, formatDuration, getScoreColor } from '../../utils/formatters';
import interviewService from '../../services/interviewService';
import { ROUTES } from '../../constants/routes';

/**
 * HistoryContent — displays real interview history from backend.
 */
const HistoryContent = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await interviewService.getHistory();
        setSessions(response.data?.sessions || []);
      } catch (err) {
      // console.error removed for production
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-64 bg-surface-soft rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-96 bg-surface-soft rounded-lg animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-surface-soft rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-display text-display-lg text-ink mb-2">Interview History</h1>
        <p className="text-body-md text-body">Review your past interview sessions and track your progress.</p>
      </motion.div>

      {sessions.length === 0 ? (
        <Card className="py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-soft flex items-center justify-center">
            <i className="bi-clock-history text-3xl text-mute" />
          </div>
          <h3 className="font-display text-heading-md text-ink mb-2">No Interviews Yet</h3>
          <p className="text-body-sm text-body mb-6">Start your first AI-powered mock interview.</p>
          <Link to={ROUTES.INTERVIEW}>
            <Button icon="bi-chat-dots">Start Interview</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session, i) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hoverable className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-soft flex items-center justify-center flex-shrink-0">
                    <i className={`text-xl ${session.type === 'technical' ? 'bi-code-slash' : session.type === 'behavioral' ? 'bi-people' : 'bi-chat-dots'} text-ink`} />
                  </div>
                  <div>
                    <p className="text-body-sm-strong text-ink mb-0.5">{session.role || 'Interview'}</p>
                    <div className="flex items-center gap-2 text-caption-sm text-mute">
                      <span>{session.company || 'General'}</span>
                      <span>·</span>
                      <span>{formatDate(session.createdAt)}</span>
                      <span>·</span>
                      <span>{session.totalQuestions || 0} questions</span>
                      {session.duration && (
                        <>
                          <span>·</span>
                          <span>{formatDuration(session.duration)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={session.status === 'completed' ? 'success' : session.status === 'active' ? 'warning' : 'default'}>
                    {session.status}
                  </Badge>
                  {session.score != null && (
                    <span className="font-display text-heading-md" style={{ color: getScoreColor(session.score) }}>
                      {session.score}%
                    </span>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryContent;
