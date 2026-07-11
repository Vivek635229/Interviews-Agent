import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/classNames';
import styles from './Card.module.scss';

/**
 * Card — DESIGN.md pricing-card / pricing-card-dark pattern.
 * Uses rounded.lg (12px) with 1px hairline border.
 */
const Card = React.forwardRef(({
  children,
  variant = 'default',
  hoverable = false,
  compact = false,
  noPadding = false,
  clickable = false,
  className,
  onClick,
  ...props
}, ref) => {
  const classes = cn(
    styles.card,
    variant === 'dark' && styles.dark,
    variant === 'soft' && styles.soft,
    hoverable && styles.hoverable,
    compact && styles.compact,
    noPadding && styles.noPadding,
    clickable && styles.clickable,
    className
  );

  return (
    <motion.div
      ref={ref}
      className={classes}
      onClick={onClick}
      whileHover={hoverable ? { y: -2 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export default Card;
