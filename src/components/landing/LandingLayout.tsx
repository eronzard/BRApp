import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { LandingNav } from './LandingNav';
import { LandingFooter } from './LandingFooter';

export const LandingLayout: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', String(isDark));
  }, [isDark]);

  return (
    <div className="min-h-screen bg-bible-50 dark:bg-bible-950 flex flex-col">
      <LandingNav isDark={isDark} onToggleDark={() => setIsDark(d => !d)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
};
