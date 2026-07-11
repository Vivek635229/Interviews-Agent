import React from 'react';
import { cn } from '../../utils/classNames';
import styles from './Input.module.scss';

/**
 * Input — DESIGN.md component.text-input / search-pill.
 * Pill-shaped (rounded.full), 40px height, hairline border.
 */
const Input = React.forwardRef(({
  label,
  type = 'text',
  variant = 'default',
  placeholder,
  helperText,
  error = false,
  disabled = false,
  iconLeft,
  iconRight,
  className,
  ...props
}, ref) => {
  if (variant === 'search') {
    return (
      <div className={cn(styles.inputWrapper, className)}>
        <i className={cn('bi-search', styles.searchIcon)} />
        <input
          ref={ref}
          type="text"
          className={styles.search}
          placeholder={placeholder || 'Search...'}
          disabled={disabled}
          {...props}
        />
      </div>
    );
  }

  return (
    <div className={cn(error && styles.error, disabled && styles.disabled, className)}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        {iconLeft && <i className={cn(iconLeft, styles.leftIcon)} />}
        <input
          ref={ref}
          type={type}
          className={cn(styles.input, iconLeft && styles.iconLeft, iconRight && styles.iconRight)}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
        {iconRight && <i className={cn(iconRight, styles.rightIcon)} />}
      </div>
      {helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

/**
 * Textarea — uses rounded.lg instead of rounded.full per DESIGN.md card pattern.
 */
export const Textarea = React.forwardRef(({
  label,
  helperText,
  error = false,
  className,
  ...props
}, ref) => (
  <div className={cn(error && styles.error, className)}>
    {label && <label className={styles.label}>{label}</label>}
    <textarea ref={ref} className={styles.textarea} {...props} />
    {helperText && <p className={styles.helperText}>{helperText}</p>}
  </div>
));

Textarea.displayName = 'Textarea';
