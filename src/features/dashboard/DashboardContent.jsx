import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatCard from '../../components/data-display/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/data-display/ProgressBar';
import ActivityItem from '../../components/data-display/ActivityItem';
import { BarChart } from '../../components/data-display/SimpleChart';
import { QUICK_ACTIONS } from '../../constants/mockData';
import { ROUTES } from '../../constants/routes';
import { formatDate, getScoreColor } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import reportService from '../../services/reportService';
import interviewService from '../../services/interviewService';

/**
 * DashboardContent — assembles all dashboard sections with real data.
 * All colors use CSS custom properties for automatic theme switching.
 */
const DashboardContent = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [categoryScores, setCategoryScores] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsResponse = await reportService.getDashboardStats();
        const data = statsResponse.data;

        setStats(data.stats || []);
        setRecentInterviews(data.recentInterviews || []);
        setPerformanceData(data.performanceOverTime || []);
        setCategoryScores(data.categoryScores || []);

        const history = await interviewService.getHistory();
        const sessions = history.data?.sessions || [];
        const activity = sessions.slice(0, 5).map((s, i) => ({
          id: i + 1,
          type: 'interview',
          message: `${s.status === 'completed' ? 'Completed' : 'Started'} ${s.role} interview`,
          time: formatRelativeFromDate(s.completedAt || s.createdAt),
          icon: 'bi-chat-dots',
        }));
        setRecentActivity(activity);
      } catch (err) {
      // console.error removed for production
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'User';

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

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-display text-display-lg text-ink">
          Welcome back, {firstName}
        </h1>
        <p className="text-body-md text-body mt-1">
          Here's your interview preparation overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.id} {...stat} delay={i * 0.1} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
          >
            <Link to={action.path}>
              <Card hoverable clickable className="text-center py-6">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${action.color === 'primary' ? 'bg-primary text-on-primary' : 'bg-surface-soft text-ink'}`}>
                  <i className={`${action.icon} text-xl`} />
                </div>
                <h3 className="text-body-sm-strong text-ink mb-1">{action.label}</h3>
                <p className="text-caption-sm text-mute">{action.description}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-heading-md text-ink">Performance Trend</h2>
            <Badge>All time</Badge>
          </div>
          {performanceData.length > 0 ? (
            <BarChart data={performanceData} height={220} />
          ) : (
            <div className="flex items-center justify-center h-[220px] text-body-sm text-mute">
              Complete some interviews to see your performance trend.
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <Card>
          <h2 className="font-display text-heading-md text-ink mb-4">Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <div className="divide-y divide-hairline">
              {recentActivity.slice(0, 4).map((activity) => (
                <ActivityItem key={activity.id} {...activity} />
              ))}
            </div>
          ) : (
            <p className="text-body-sm text-mute py-8 text-center">
              No recent activity yet. Start an interview!
            </p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Interviews */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-heading-md text-ink">Recent Interviews</h2>
            <Link to={ROUTES.INTERVIEW_HISTORY}>
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </div>
          {recentInterviews.length > 0 ? (
            <div className="space-y-3">
              {recentInterviews.slice(0, 4).map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-soft transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-soft flex items-center justify-center text-sm">
                      <i className="bi-chat-dots text-charcoal" />
                    </div>
                    <div>
                      <p className="text-body-sm-strong text-ink">{interview.role}</p>
                      <p className="text-caption-sm text-mute">{interview.company || 'General'} · {formatDate(interview.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-body-sm-strong" style={{ color: getScoreColor(interview.score) }}>{interview.score}%</p>
                    <p className="text-caption-sm text-mute">{interview.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-body-sm text-mute py-8 text-center">
              No interviews yet. Start your first one!
            </p>
          )}
        </Card>

        {/* Skills Progress */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-heading-md text-ink">Category Scores</h2>
            <Link to={ROUTES.REPORTS}>
              <Button variant="ghost" size="sm">Details</Button>
            </Link>
          </div>
          {categoryScores.length > 0 ? (
            <div className="space-y-4">
              {categoryScores.slice(0, 6).map((cat) => (
                <ProgressBar key={cat.category} label={cat.category} value={cat.score} height={6} />
              ))}
            </div>
          ) : (
            <p className="text-body-sm text-mute py-8 text-center">
              Complete interviews to see category scores.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

/** Helper to convert a date to relative time string */
function formatRelativeFromDate(dateString) {
  if (!dateString) return 'Unknown';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export default DashboardContent;
