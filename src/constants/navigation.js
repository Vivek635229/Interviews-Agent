// ═══════════════════════════════════════════════════════════════
// Navigation Constants
// ═══════════════════════════════════════════════════════════════

import { ROUTES } from './routes';

export const PUBLIC_NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

export const SIDEBAR_LINKS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'bi-grid-1x2' },
  { label: 'New Interview', path: ROUTES.INTERVIEW, icon: 'bi-chat-dots' },
  { label: 'Upload Resume', path: ROUTES.RESUME_UPLOAD, icon: 'bi-cloud-arrow-up' },
  { label: 'Resume Analysis', path: ROUTES.RESUME_ANALYSIS, icon: 'bi-file-earmark-bar-graph' },
  { label: 'Interview History', path: ROUTES.INTERVIEW_HISTORY, icon: 'bi-clock-history' },
  { label: 'Reports', path: ROUTES.REPORTS, icon: 'bi-graph-up-arrow' },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: 'bi-gear' },
];

export const FOOTER_LINKS = [
  { label: 'About', href: '#' },
  { label: 'Documentation', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'GitHub', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Contact', href: '#' },
];
