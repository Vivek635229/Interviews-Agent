import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../constants/designTokens';

/**
 * StaggerChildren — staggers child animations for lists and grids.
 */
const StaggerChildren = ({ children, className, delay = 0 }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: delay },
      },
    }}
  >
    {children}
  </motion.div>
);

/**
 * StaggerItem — individual item in a stagger group.
 */
export const StaggerItem = ({ children, className }) => (
  <motion.div className={className} variants={fadeInUp}>
    {children}
  </motion.div>
);

export default StaggerChildren;
