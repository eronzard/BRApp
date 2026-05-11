import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo';
import { Mail } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bible-900 dark:bg-bible-950 text-bible-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Logo size={36} className="mb-3 [&_span]:!text-white [&_.font-sans]:!text-bible-400" />
            <p className="text-bible-300 text-sm leading-relaxed max-w-xs">
              Bringing teams together around the Word — one passage, one week, one community at a time.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-bible-400 text-xs uppercase tracking-widest font-semibold mb-3">Pages</p>
              <ul className="space-y-2">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/about', label: 'About' },
                  { to: '/how-it-works', label: 'How It Works' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-bible-300 hover:text-white text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-bible-400 text-xs uppercase tracking-widest font-semibold mb-3">More</p>
              <ul className="space-y-2">
                {[
                  { to: '/faq', label: 'FAQ' },
                  { to: '/contact', label: 'Contact' },
                  { to: '/donate', label: 'Donate' },
                  { to: '/web', label: 'Enter App' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-bible-300 hover:text-white text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-bible-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-bible-400 text-xs">
          <span>© {year} Bible Room. All rights reserved.</span>
          <a href="mailto:team@bibleroom.app" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail size={13} />
            team@bibleroom.app
          </a>
        </div>
      </div>
    </footer>
  );
};
