// ═══════════════════════════════════════════════════════════════
// DESIGN.md Tokens — JavaScript Constants
// For use in Framer Motion, GSAP, and inline styles
// ═══════════════════════════════════════════════════════════════

export const colors = {
  primary: '#000000',
  onPrimary: '#ffffff',
  ink: '#000000',
  inkDeep: '#090909',
  charcoal: '#525252',
  body: '#737373',
  mute: '#a3a3a3',
  canvas: '#ffffff',
  surfaceSoft: '#fafafa',
  surfaceCard: '#ffffff',
  hairline: '#e5e5e5',
  hairlineStrong: '#d4d4d4',
  onDark: '#ffffff',
  onDarkMute: 'rgba(255,255,255,0.7)',
  surfaceDark: '#171717',
  focusRing: 'rgba(59,130,246,0.5)',
  terminalRed: '#ff5f56',
  terminalYellow: '#ffbd2e',
  terminalGreen: '#27c93f',
  accent500: '#3b82f6',
  success: '#27c93f',
  warning: '#ffbd2e',
  danger: '#ff5f56',
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  section: 88,
};

export const rounded = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  full: 9999,
};

export const motion = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  easeSmooth: [0.4, 0, 0.2, 1],
  easeSpring: [0.34, 1.56, 0.64, 1],
};

// Framer Motion variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: motion.base, ease: motion.easeSmooth } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: motion.base } },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: motion.base, ease: motion.easeSmooth } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: motion.base, ease: motion.easeSmooth } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: motion.base, ease: motion.easeSpring } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: motion.easeSmooth } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};
