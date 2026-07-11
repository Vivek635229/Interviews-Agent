import React from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getScoreColor } from '../../utils/formatters';

/**
 * ProgressBar — animated horizontal progress bar.
 */
const ProgressBar = ({ value, max = 100, label, showValue = true, height = 8, color, className }) => {
  const [ref, isVisible] = useScrollReveal();
  const percentage = Math.min((value / max) * 100, 100);
  const fillColor = color || getScoreColor(value);

  return (
    <div ref={ref} className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-body-sm text-ink font-medium">{label}</span>}
          {showValue && <span className="text-body-sm text-body">{Math.round(value)}%</span>}
        </div>
      )}
      <div
        className="w-full bg-surface-soft rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: fillColor }}
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${percentage}%` : 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
