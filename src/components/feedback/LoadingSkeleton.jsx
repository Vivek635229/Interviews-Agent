import React from 'react';
import { cn } from '../../utils/classNames';

/**
 * LoadingSkeleton — shimmer loading placeholder.
 * Following DESIGN.md surface-soft aesthetic.
 */
const LoadingSkeleton = ({ width, height, rounded = 'md', className, count = 1 }) => {
  const radiusMap = { sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' };

  const elements = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={cn(
        'animate-pulse bg-surface-soft',
        radiusMap[rounded],
        className
      )}
      style={{ width, height: height || '16px', marginBottom: count > 1 ? '8px' : 0 }}
    />
  ));

  return count === 1 ? elements[0] : <div>{elements}</div>;
};

export default LoadingSkeleton;

/**
 * CardSkeleton — full card loading placeholder.
 */
export const CardSkeleton = ({ className }) => (
  <div className={cn('border border-hairline rounded-lg p-6 space-y-4', className)}>
    <LoadingSkeleton width="40%" height="20px" />
    <LoadingSkeleton width="100%" height="14px" count={3} />
    <LoadingSkeleton width="60%" height="14px" />
  </div>
);
