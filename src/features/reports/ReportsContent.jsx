import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StatCard from '../../components/data-display/StatCard';
import ProgressBar from '../../components/data-display/ProgressBar';
import { BarChart } from '../../components/data-display/SimpleChart';
import { formatDate, getScoreColor } from '../../utils/formatters';
import reportService from '../../services/reportService';

/**
 * ReportsContent — displays real performance reports from backend.
 */
const ReportsContent = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [expandedReport, setExpandedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, statsRes] = await Promise.all([
          reportService.getUserReports(),
          reportService.getDashboardStats(),
        ]);
        setReports(reportsRes.data?.reports || []);
        setStats(statsRes.data || null);
      } catch (err) {
      // console.error removed for production
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-64 bg-surface-soft rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-96 bg-surface-soft rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-surface-soft rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Compute aggregate stats
  const totalInterviews = reports.length;
  const avgScore = totalInterviews > 0
    ? Math.round(reports.reduce((sum, r) => sum + (r.overallScore || 0), 0) / totalInterviews)
    : 0;
  const bestScore = totalInterviews > 0
    ? Math.max(...reports.map((r) => r.overallScore || 0))
    : 0;
  const totalHours = stats?.stats?.find((s) => s.label === 'Practice Hours')?.value || 0;

  const summaryStats = [
    { id: 1, label: 'Total Interviews', value: totalInterviews, icon: 'bi-chat-dots' },
    { id: 2, label: 'Average Score', value: avgScore, icon: 'bi-graph-up-arrow', suffix: '%' },
    { id: 3, label: 'Best Score', value: bestScore, icon: 'bi-trophy', suffix: '%' },
    { id: 4, label: 'Practice Hours', value: totalHours, icon: 'bi-clock', suffix: 'h' },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-display text-display-lg text-ink mb-2">Reports</h1>
        <p className="text-body-md text-body">Detailed analytics and performance insights from your interviews.</p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, i) => (
          <StatCard key={stat.id} {...stat} delay={i * 0.1} />
        ))}
      </div>

      {reports.length === 0 ? (
        <Card className="py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-soft flex items-center justify-center">
            <i className="bi-graph-up-arrow text-3xl text-mute" />
          </div>
          <h3 className="font-display text-heading-md text-ink mb-2">No Reports Yet</h3>
          <p className="text-body-sm text-body mb-6">Complete some interviews to see detailed performance reports.</p>
        </Card>
      ) : (
        <>
          {/* Performance Chart */}
          {(stats?.performanceOverTime || []).length > 0 && (
            <Card>
              <h2 className="font-display text-heading-md text-ink mb-6">Performance Over Time</h2>
              <BarChart data={stats.performanceOverTime} height={220} />
            </Card>
          )}

          {/* Category Scores */}
          {(stats?.categoryScores || []).length > 0 && (
            <Card>
              <h2 className="font-display text-heading-md text-ink mb-6">Category Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.categoryScores.map((cat) => (
                  <ProgressBar key={cat.category} label={cat.category} value={cat.score} height={8} />
                ))}
              </div>
            </Card>
          )}

          {/* Reports List */}
          <Card>
            <h2 className="font-display text-heading-md text-ink mb-6">All Reports</h2>
            <div className="space-y-3">
              {reports.map((report, i) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div
                    className="p-4 rounded-lg border border-hairline hover:bg-surface-soft transition-colors cursor-pointer"
                    onClick={() => setExpandedReport(expandedReport === report._id ? null : report._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-heading-md" style={{ color: getScoreColor(report.overallScore) }}>
                          {report.overallScore}%
                        </span>
                        <div>
                          <p className="text-body-sm-strong text-ink">{report.role || 'Interview'}{report.company ? ` — ${report.company}` : ''}</p>
                          <div className="flex items-center gap-2 text-caption-sm text-mute">
                            <span>{formatDate(report.createdAt)}</span>
                            <span>·</span>
                            <span>{report.interviewType}</span>
                            <span>·</span>
                            <span>{report.questionsAnswered}/{report.totalQuestions} answered</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={report.difficulty === 'hard' ? 'danger' : report.difficulty === 'medium' ? 'warning' : 'default'} size="sm">
                          {report.difficulty}
                        </Badge>
                        <i className={`bi-chevron-${expandedReport === report._id ? 'up' : 'down'} text-mute`} />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedReport === report._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-hairline space-y-4"
                      >
                        {report.summary && (
                          <p className="text-body-sm text-body">{report.summary}</p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(report.strengths || []).length > 0 && (
                            <div>
                              <p className="text-body-sm-strong text-ink mb-2">✅ Strengths</p>
                              <ul className="space-y-1.5">
                                {report.strengths.map((s, j) => (
                                  <li key={j} className="text-caption-sm text-body flex items-start gap-2">
                                    <span className="text-terminal-green mt-0.5">•</span> {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(report.weaknesses || []).length > 0 && (
                            <div>
                              <p className="text-body-sm-strong text-ink mb-2">📈 Areas to Improve</p>
                              <ul className="space-y-1.5">
                                {report.weaknesses.map((w, j) => (
                                  <li key={j} className="text-caption-sm text-body flex items-start gap-2">
                                    <span className="text-amber-500 mt-0.5">•</span> {w}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        {(report.recommendations || []).length > 0 && (
                          <div>
                            <p className="text-body-sm-strong text-ink mb-2">💡 Recommendations</p>
                            <ul className="space-y-1.5">
                              {report.recommendations.map((r, j) => (
                                <li key={j} className="text-caption-sm text-body flex items-start gap-2">
                                  <span className="text-primary mt-0.5">•</span> {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {(report.categoryScores || []).length > 0 && (
                          <div>
                            <p className="text-body-sm-strong text-ink mb-3">Category Scores</p>
                            <div className="space-y-2">
                              {report.categoryScores.map((cat) => (
                                <ProgressBar key={cat.category} label={cat.category} value={cat.score} height={6} />
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ReportsContent;
