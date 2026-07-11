import React from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getScoreColor } from '../../utils/formatters';

/**
 * SimpleChart — lightweight CSS/SVG charts (no heavy library).
 */

/** Vertical bar chart */
export const BarChart = ({ data, height = 200, className }) => {
  const [ref, isVisible] = useScrollReveal();
  const maxValue = Math.max(...data.map((d) => d.score || d.value));

  return (
    <div ref={ref} className={`flex items-end gap-3 ${className || ''}`} style={{ height }}>
      {data.map((item, i) => {
        const barHeight = ((item.score || item.value) / maxValue) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-caption-sm text-body">{item.score || item.value}%</span>
            <motion.div
              className="w-full rounded-t-md min-h-[4px]"
              style={{ backgroundColor: getScoreColor(item.score || item.value) }}
              initial={{ height: 0 }}
              animate={{ height: isVisible ? `${barHeight}%` : 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
            />
            <span className="text-caption-sm text-mute text-center leading-tight">{item.label || item.month || item.category}</span>
          </div>
        );
      })}
    </div>
  );
};

/** Donut chart */
export const DonutChart = ({ segments, size = 160, strokeWidth = 20, className }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  let offset = 0;

  const colors = ['#000000', '#525252', '#737373', '#a3a3a3', '#d4d4d4', '#e5e5e5'];

  return (
    <div className={`relative inline-flex items-center justify-center ${className || ''}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((seg, i) => {
          const segLength = (seg.value / 100) * circumference;
          const currentOffset = offset;
          offset += segLength;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segLength} ${circumference - segLength}`}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
};
