import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';

/**
 * CountUp — GSAP animated number counter.
 */
const CountUp = ({ value, duration = 2, suffix = '', prefix = '', decimals = 0, className }) => {
  const [ref, displayValue] = useCountUp(value, { duration, decimals });

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
};

export default CountUp;
