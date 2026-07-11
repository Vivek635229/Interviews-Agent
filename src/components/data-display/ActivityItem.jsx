import React from 'react';
import { cn } from '../../utils/classNames';

/**
 * ActivityItem — activity feed item with icon, message, and timestamp.
 */
const ActivityItem = ({ icon, message, time, className }) => (
  <div className={cn('flex items-start gap-3 py-3', className)}>
    <div className="w-8 h-8 rounded-full bg-surface-soft flex items-center justify-center flex-shrink-0 mt-0.5">
      <i className={cn(icon, 'text-sm text-charcoal')} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-body-sm text-ink">{message}</p>
      <p className="text-caption-sm text-mute mt-0.5">{time}</p>
    </div>
  </div>
);

export default ActivityItem;
