import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import { ROUTES } from '../../constants/routes';

/**
 * Header — sticky top bar for authenticated dashboard pages.
 * Uses CSS custom properties for automatic theme switching.
 */
const Header = ({ setSidebarOpen }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[260px] h-[56px] bg-canvas backdrop-blur-md border-b border-hairline flex items-center justify-between px-4 sm:px-6 z-40 transition-all duration-base shadow-soft">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-md text-ink hover:bg-surface-soft transition-colors"
          aria-label="Open Sidebar"
        >
          <i className="bi-list text-xl" />
        </button>
        <span className="font-display text-body-strong text-ink hidden md:inline-block">
          Dashboard
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-ink hover:bg-surface-soft transition-colors"
          aria-label="Toggle Theme"
        >
          <i className={`bi-${theme === 'light' ? 'moon' : 'sun'} text-lg`} />
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-md text-ink hover:bg-surface-soft transition-colors relative"
          aria-label="Notifications"
        >
          <i className="bi-bell text-lg" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-hairline" />

        {/* Profile */}
        <Link to={ROUTES.SETTINGS} className="flex items-center gap-2.5">
          <Avatar name={user?.name || 'User'} size="sm" />
          <span className="text-body-sm font-medium text-ink hidden sm:inline-block">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
