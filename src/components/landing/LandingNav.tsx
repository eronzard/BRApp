import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from '../Logo';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface LandingNavProps {
  isDark: boolean;
  onToggleDark: () => void;
}

const NAV_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
  { to: '/donate', label: 'Donate' },
];

export const LandingNav: React.FC<LandingNavProps> = ({ isDark, onToggleDark }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-bible-900/90 backdrop-blur border-b border-bible-100 dark:border-bible-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <Logo size={36} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-bible-600 dark:text-bible-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-bible-600 dark:hover:text-bible-400'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-bible-100 dark:hover:bg-bible-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/web"
            className="hidden sm:inline-flex items-center px-4 py-2 bg-bible-600 hover:bg-bible-700 text-white text-sm font-bold rounded-xl shadow transition-colors"
          >
            Enter App
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-bible-100 dark:hover:bg-bible-800 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-bible-100 dark:border-bible-800 bg-white dark:bg-bible-900 px-4 py-4 flex flex-col gap-3">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium py-1 ${
                  isActive ? 'text-bible-600 dark:text-bible-400' : 'text-gray-700 dark:text-gray-200'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/web"
            onClick={() => setMenuOpen(false)}
            className="mt-2 text-center px-4 py-2 bg-bible-600 hover:bg-bible-700 text-white text-sm font-bold rounded-xl shadow transition-colors"
          >
            Enter App
          </Link>
        </div>
      )}
    </header>
  );
};
