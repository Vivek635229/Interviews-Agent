import React from 'react';
import { Link } from 'react-router-dom';
import { FOOTER_LINKS } from '../../constants/navigation';
import { ROUTES } from '../../constants/routes';

/**
 * Footer — DESIGN.md component.footer-section.
 * canvas bg, 1px top border, caption-sm links.
 */
const Footer = () => (
  <footer className="bg-canvas border-t border-hairline">
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
            <i className="bi-cpu text-on-primary text-xs" />
          </div>
          <span className="font-display text-sm font-semibold text-ink">InterviewAI</span>
        </Link>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-caption-sm text-body hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-caption-sm text-mute">
          © 2026 InterviewAI
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
