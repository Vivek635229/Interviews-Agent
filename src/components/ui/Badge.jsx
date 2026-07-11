import React from 'react';
import { cn } from '../../utils/classNames';

/**
 * Badge — pill-shaped status indicators per DESIGN.md.
 * Colors use opacity-based backgrounds that work in both light and dark themes.
 */
const Badge = ({ children, variant = 'default', size = 'md', icon, className }) => {
  const baseClasses = 'inline-flex items-center gap-1 rounded-full font-body font-medium whitespace-nowrap';

  const variants = {
    default: 'bg-surface-soft text-ink',
    success: 'bg-green-600/10 text-green-600',
    warning: 'bg-yellow-600/10 text-yellow-600',
    danger: 'bg-red-600/10 text-red-600',
    info: 'bg-blue-600/10 text-blue-600',
    dark: 'bg-surface-dark text-on-dark',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-caption-sm px-2.5 py-0.5',
    lg: 'text-body-sm px-3 py-1',
  };

  return (
    <span className={cn(baseClasses, variants[variant], sizes[size], className)}>
      {icon && <i className={icon} />}
      {children}
    </span>
  );
};

export default Badge;
