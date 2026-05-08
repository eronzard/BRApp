
import React from 'react';

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`px-3 sm:px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
      active 
        ? 'bg-bible-100 dark:bg-bible-800 text-bible-800 dark:text-bible-200 shadow-sm' 
        : 'text-gray-400 dark:text-gray-500 hover:text-bible-600 dark:hover:text-bible-300 hover:bg-white dark:hover:bg-bible-800/50'
    }`}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
  </button>
);

export const MobileNavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center p-2 rounded-xl w-full transition-all ${
      active 
        ? 'text-bible-800 dark:text-bible-200 bg-bible-50 dark:bg-bible-800 shadow-inner' 
        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
    }`}
  >
    {icon}
    <span className="text-[10px] font-bold mt-1 uppercase tracking-widest">{label}</span>
  </button>
);
