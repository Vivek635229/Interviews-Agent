import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { ROUTES } from '../constants/routes';

/**
 * NotFound — 404 page with illustration and back-to-home CTA.
 */
const NotFound = () => (
  <div className="min-h-[calc(100vh-56px)] flex items-center justify-center py-12 px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center max-w-md"
    >
      <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-surface-soft flex items-center justify-center">
        <span className="font-display text-display-xl text-mute">404</span>
      </div>
      <h1 className="font-display text-display-lg text-ink mb-3">Page not found</h1>
      <p className="text-body-md text-body mb-8">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to={ROUTES.HOME}>
          <Button icon="bi-arrow-left">Back to Home</Button>
        </Link>
        <Link to={ROUTES.DASHBOARD}>
          <Button variant="secondary" icon="bi-grid-1x2">Go to Dashboard</Button>
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
