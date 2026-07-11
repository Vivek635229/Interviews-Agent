import React from 'react';
import { cn } from '../../utils/classNames';

/**
 * Divider — hairline divider per DESIGN.md elevation level 1.
 */
const Divider = ({ className, vertical = false }) => (
  <div
    className={cn(
      vertical
        ? 'w-px h-full bg-hairline'
        : 'w-full h-px bg-hairline',
      className
    )}
  />
);

export default Divider;
