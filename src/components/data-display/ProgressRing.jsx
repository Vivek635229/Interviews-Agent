import React from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getScoreColor } from '../../utils/formatters';
import CountUp from '../animations/CountUp';

/**
 * ProgressRing — SVG circular progress indicator with counter.
 */
const ProgressRing = ({ value, size = 120, strokeWidth = 8, label, className }) => {
  const [ref, isVisible] = useScrollReveal();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const fillColor = getScoreColor(value);

  return (
    <div ref={ref} className={`flex flex-col items-center ${className || ''}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={strokeWidth}
          />
          {/* Animated fill */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={fillColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: isVisible ? circumference - (value / 100) * circumference : circumference }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-heading-lg text-ink">
            <CountUp value={value} suffix="%" />
          </span>
        </div>
      </div>
      {label && <p className="text-body-sm text-body mt-2">{label}</p>}
    </div>
  );
};

export default ProgressRing;
