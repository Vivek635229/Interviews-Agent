import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SIDEBAR_LINKS } from '../../constants/navigation';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import { cn } from '../../utils/classNames';
import styles from './Sidebar.module.scss';

/**
 * Sidebar — app navigation drawer.
 * Uses CSS custom properties for automatic light/dark theming.
 */
const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setOpen]);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const userName = user?.name || 'User';
  const userEmail = user?.email || '';

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside
        className={cn(styles.sidebar, open && styles.open)}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className={styles.header}>
          <Link to={ROUTES.DASHBOARD} className={styles.brand} onClick={() => setOpen(false)}>
            <div className={styles.logo}>
              <i className="bi-cpu" />
            </div>
            <span className={styles.brandName}>InterviewAI</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-2 rounded-md text-ink hover:bg-surface-soft transition-colors"
            aria-label="Close sidebar"
          >
            <i className="bi-x-lg text-lg" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            <p className={styles.groupLabel}>Menu</p>
            {SIDEBAR_LINKS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(styles.navItem, location.pathname === item.path && styles.active)}
                onClick={() => setOpen(false)}
              >
                <i className={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* User footer */}
        <div className={styles.footer}>
          <Link to={ROUTES.SETTINGS} className={styles.userInfo} onClick={() => setOpen(false)}>
            <Avatar name={userName} size="sm" />
            <div className="overflow-hidden">
              <p className={styles.userName}>{userName}</p>
              <p className={styles.userEmail}>{userEmail}</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-body-sm text-body hover:bg-surface-soft hover:text-ink transition-all"
            title="Logout"
          >
            <i className="bi-box-arrow-left text-base" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
