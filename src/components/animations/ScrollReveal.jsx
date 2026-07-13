import React from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';

/**
 * ScrollReveal — wraps children with fade-in-up on scroll.
 */
const ScrollReveal = ({ children, className, delay = 0, direction = 'up' }) => {
  const [ref, isVisible] = useScrollReveal();

  const variants = {
    up: { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } },
    fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants[direction]}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
