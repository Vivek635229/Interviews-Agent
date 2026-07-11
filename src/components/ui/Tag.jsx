import React from 'react';
import { cn } from '../../utils/classNames';

/**
 * Tag — DESIGN.md component.command-tag (pill chip with code styling).
 */
const Tag = ({ children, icon, variant = 'default', className, onClick }) => {
  const variants = {
    default: 'bg-surface-soft text-ink',
    dark: 'bg-surface-dark text-on-dark',
    outline: 'bg-canvas text-ink border border-hairline',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body-sm font-mono',
        variants[variant],
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
      onClick={onClick}
    >
      {icon && <i className={icon} />}
      {children}
    </span>
  );
};

export default Tag;
