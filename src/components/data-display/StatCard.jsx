import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import CountUp from '../animations/CountUp';
import { cn } from '../../utils/classNames';

/**
 * StatCard — dashboard statistics card with animated counter.
 */
const StatCard = ({ label, value, icon, suffix = '', trend, trendUp, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Card hoverable className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-body-sm text-body mb-1">{label}</p>
          <p className="font-display text-display-lg text-ink">
            <CountUp value={value} suffix={suffix} />
          </p>
          {trend && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-caption-sm font-medium',
              trendUp ? 'text-green-600' : 'text-red-500'
            )}>
              <i className={trendUp ? 'bi-arrow-up-short' : 'bi-arrow-down-short'} />
              <span>{trend}</span>
              <span className="text-mute">vs last month</span>
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center flex-shrink-0">
          <i className={cn(icon, 'text-lg text-ink')} />
        </div>
      </div>
    </Card>
  </motion.div>
);

export default StatCard;
