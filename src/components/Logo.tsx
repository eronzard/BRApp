
import React from 'react';
import { BookOpen } from 'lucide-react';

export const Logo: React.FC<{ size?: number; className?: string; iconOnly?: boolean }> = ({ size = 32, className = "", iconOnly = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center justify-center overflow-hidden" style={{ width: size, height: size }}>
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" className="w-full h-full">
          <defs>
            <style>{`.cls-1 { fill: #99582a; }`}</style>
          </defs>
          <path className="cls-1" d="M1360,448c51.28,0,99.5,19.97,135.76,56.24,36.26,36.26,56.24,84.48,56.24,135.76v720c0,51.29-19.97,99.5-56.24,135.76-36.26,36.26-84.48,56.24-135.76,56.24h-720c-51.28,0-99.5-19.97-135.76-56.24-36.26-36.26-56.24-84.48-56.24-135.76v-720c0-51.29,19.97-99.5,56.24-135.76,36.26-36.26,84.48-56.24,135.76-56.24h720M1360,400h-720c-132.55,0-240,107.45-240,240v720c0,132.55,107.45,240,240,240h720c132.55,0,240-107.45,240-240v-720c0-132.55-107.45-240-240-240h0Z"/>
          <path className="cls-1" d="M1180,400h-540c-132.55,0-240,107.45-240,240v720c0,132.55,107.45,240,240,240h540c132.55,0,240-107.45,240-240v-720c0-132.55-107.45-240-240-240ZM1222,1066c-36.45,0-66-29.55-66-66s29.55-66,66-66,66,29.55,66,66-29.55,66-66,66Z"/>
        </svg>
      </div>
      {!iconOnly && (
        <div className="flex flex-col justify-center">
          <span className="font-serif font-bold text-bible-900 dark:text-white tracking-tight leading-tight" style={{ fontSize: `${size * 0.7}px` }}>
            Bible
          </span>
          <span className="font-sans font-bold text-bible-500 uppercase tracking-[0.2em] leading-tight" style={{ fontSize: `${size * 0.3}px` }}>
            Room
          </span>
        </div>
      )}
    </div>
  );
};

export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = "" }) => (
  <div className={`flex items-center justify-center overflow-hidden ${className}`} style={{ width: size, height: size }}>
    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" className="w-full h-full">
      <defs>
        <style>{`.cls-1 { fill: #99582a; }`}</style>
      </defs>
      <path className="cls-1" d="M1360,448c51.28,0,99.5,19.97,135.76,56.24,36.26,36.26,56.24,84.48,56.24,135.76v720c0,51.29-19.97,99.5-56.24,135.76-36.26,36.26-84.48,56.24-135.76,56.24h-720c-51.28,0-99.5-19.97-135.76-56.24-36.26-36.26-56.24-84.48-56.24-135.76v-720c0-51.29,19.97-99.5,56.24-135.76,36.26-36.26,84.48-56.24,135.76-56.24h720M1360,400h-720c-132.55,0-240,107.45-240,240v720c0,132.55,107.45,240,240,240h720c132.55,0,240-107.45,240-240v-720c0-132.55-107.45-240-240-240h0Z"/>
      <path className="cls-1" d="M1180,400h-540c-132.55,0-240,107.45-240,240v720c0,132.55,107.45,240,240,240h540c132.55,0,240-107.45,240-240v-720c0-132.55-107.45-240-240-240ZM1222,1066c-36.45,0-66-29.55-66-66s29.55-66,66-66,66,29.55,66,66-29.55,66-66,66Z"/>
    </svg>
  </div>
);
