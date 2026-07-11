import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';

/**
 * Hero — Landing page hero section.
 * display-xl headline, body description, black pill CTA.
 * Adapted from DESIGN.md hero pattern with AI SaaS context.
 */
const Hero = () => (
  <section className="relative overflow-hidden">
    <div className="max-w-[900px] mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28 text-center">
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 bg-surface-soft rounded-full px-4 py-1.5 mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
        <span className="text-body-sm text-body">Powered by IBM Granite AI</span>
      </motion.div>

      {/* Headline — display-xl per DESIGN.md */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-display text-display-xl md:text-[48px] md:leading-[1.1] text-ink mb-6"
      >
        Master every interview{' '}
        <br className="hidden md:block" />
        with your AI trainer
      </motion.h1>

      {/* Description — body-md per DESIGN.md */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-body-md text-body max-w-[560px] mx-auto mb-10"
      >
        Practice with AI-powered mock interviews, get instant feedback on your resume, 
        and track your progress — all in one premium platform.
      </motion.p>

      {/* CTAs — black pill primary per DESIGN.md */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <Link to={ROUTES.DASHBOARD}>
          <Button size="lg" icon="bi-play-circle">
            Start Practicing
          </Button>
        </Link>
        <Link to={ROUTES.LOGIN}>
          <Button variant="secondary" size="lg" icon="bi-arrow-right">
            Watch Demo
          </Button>
        </Link>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-hairline"
      >
        {[
          { value: '10K+', label: 'Interviews Conducted' },
          { value: '95%', label: 'User Satisfaction' },
          { value: '50+', label: 'Interview Categories' },
          { value: '24/7', label: 'AI Availability' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-display text-heading-lg text-ink">{stat.value}</p>
            <p className="text-caption-sm text-mute">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>

    {/* Subtle background decoration — respects DESIGN.md no-gradients rule, using opacity only */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-surface-soft rounded-full blur-3xl opacity-50 -z-10" />
  </section>
);

export default Hero;
