import React from 'react';
import { getInitials } from '../../utils/formatters';
import { cn } from '../../utils/classNames';

/**
 * Avatar — rounded.full circular avatar with initials fallback.
 */
const Avatar = ({ name, src, size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8 text-caption-sm',
    md: 'w-10 h-10 text-body-sm',
    lg: 'w-12 h-12 text-body-md',
    xl: 'w-16 h-16 text-heading-md',
  };

  const base = cn(
    'inline-flex items-center justify-center rounded-full bg-surface-dark text-on-dark font-display font-semibold flex-shrink-0',
    sizes[size],
    className
  );

  if (src) {
    return <img src={src} alt={name} className={cn(base, 'object-cover')} />;
  }

  return (
    <div className={base}>
      {getInitials(name || 'User')}
    </div>
  );
};

export default Avatar;
