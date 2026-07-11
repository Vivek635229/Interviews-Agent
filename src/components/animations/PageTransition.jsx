import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageTransition } from '../../constants/designTokens';

/**
 * PageTransition — AnimatePresence wrapper for route transitions.
 */
const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
