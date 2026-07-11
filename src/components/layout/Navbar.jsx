import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button, { IconButton } from '../ui/Button';
import Avatar from '../ui/Avatar';
import { PUBLIC_NAV_LINKS } from '../../constants/navigation';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.scss';

/**
 * Navbar — public page header with theme toggle and mobile slide-over drawer.
 * All colors use CSS custom properties for automatic theme switching.
 */
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Sync theme class on <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => document.body.classList.remove('menu-open');
  }, [mobileOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      <div className={styles.container}>
        {/* Brand */}
        <Link to={ROUTES.HOME} className={styles.brand}>
          <div className={styles.logo}>
            <i className="bi-cpu" />
          </div>
          <span className={styles.brandName}>InterviewAI</span>
        </Link>

        {/* Desktop Links */}
        <div className={styles.navLinks}>
          {PUBLIC_NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.navActions}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-ink hover:bg-surface-soft transition-colors"
            aria-label="Toggle Theme"
          >
            <i className={`bi-${theme === 'light' ? 'moon' : 'sun'} text-lg`} />
          </button>

          {isAuthenticated ? (
            <>
              <span className={styles.hideOnMobile}>
                <Link to={ROUTES.DASHBOARD}>
                  <Button size="sm" icon="bi-grid-1x2">Dashboard</Button>
                </Link>
              </span>
              <span className={styles.hideOnMobile}>
                <Link to={ROUTES.SETTINGS} className="flex items-center gap-2">
                  <Avatar name={user?.name || 'User'} size="sm" />
                </Link>
              </span>
            </>
          ) : (
            <>
              <span className={styles.hideOnMobile}>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
              </span>
              <span className={styles.hideOnMobile}>
                <Link to={ROUTES.REGISTER}>
                  <Button size="sm">Get Started</Button>
                </Link>
              </span>
            </>
          )}

          {/* Mobile menu toggle */}
          <span className={styles.menuButton}>
            <IconButton
              icon="bi-list"
              label="Open menu"
              onClick={() => setMobileOpen(true)}
            />
          </span>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className={styles.mobileMenuOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            />

            {/* Slide-over drawer */}
            <motion.div
              className={styles.mobileMenu}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between pb-6 border-b border-hairline">
                <Link to={ROUTES.HOME} className={styles.brand} onClick={() => setMobileOpen(false)}>
                  <div className={styles.logo}>
                    <i className="bi-cpu" />
                  </div>
                  <span className={styles.brandName}>InterviewAI</span>
                </Link>
                <IconButton
                  icon="bi-x-lg"
                  label="Close menu"
                  onClick={() => setMobileOpen(false)}
                />
              </div>

              {/* Navigation links */}
              <div className="flex flex-col gap-1 py-4 flex-1">
                {PUBLIC_NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between py-3 px-4 rounded-lg text-body hover:bg-surface-soft hover:text-ink font-medium transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{link.label}</span>
                    <i className="bi-chevron-right text-caption-sm text-mute" />
                  </a>
                ))}
              </div>

              {/* Drawer footer actions */}
              <div className="pt-6 border-t border-hairline space-y-4">
                {/* Theme toggle row */}
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-body-sm text-body">Theme</span>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-hairline text-ink hover:bg-surface-soft transition-colors"
                  >
                    <i className={`bi-${theme === 'light' ? 'moon' : 'sun'}`} />
                    <span className="text-body-sm font-medium capitalize">{theme}</span>
                  </button>
                </div>

                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Link to={ROUTES.SETTINGS} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-soft" onClick={() => setMobileOpen(false)}>
                      <Avatar name={user?.name || 'User'} size="sm" />
                      <div className="text-left">
                        <p className="text-body-sm font-medium text-ink">{user?.name || 'User'}</p>
                        <p className="text-caption-sm text-mute">{user?.email}</p>
                      </div>
                    </Link>
                    <Link to={ROUTES.DASHBOARD} onClick={() => setMobileOpen(false)}>
                      <Button fullWidth icon="bi-grid-1x2">Dashboard</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>
                      <Button variant="secondary" fullWidth>Sign in</Button>
                    </Link>
                    <Link to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)}>
                      <Button fullWidth>Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
