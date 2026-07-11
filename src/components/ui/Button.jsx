import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/classNames';
import styles from './Button.module.scss';

/**
 * Button — DESIGN.md component.button-primary / button-secondary / button-disabled
 * All buttons are pill-shaped (rounded.full) per DESIGN.md.
 */
const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  loading = false,
  as = 'button',
  className,
  ...props
}, ref) => {
  const Component = as === 'button' ? motion.button : motion.a;

  const classes = cn(
    styles[variant],
    size !== 'md' && styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    loading && styles.loading,
    className
  );

  return (
    <Component
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      {...props}
    >
      {icon && <i className={icon} />}
      {children}
      {iconRight && <i className={iconRight} />}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;

/**
 * IconButton — icon-only variant
 */
export const IconButton = React.forwardRef(({
  icon,
  size = 'md',
  variant = 'ghost',
  label,
  className,
  ...props
}, ref) => (
  <motion.button
    ref={ref}
    className={cn(styles.icon, size !== 'md' && styles[size], className)}
    whileTap={{ scale: 0.9 }}
    aria-label={label}
    title={label}
    {...props}
  >
    <i className={icon} />
  </motion.button>
));

IconButton.displayName = 'IconButton';
